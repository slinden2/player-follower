const jwt = require('json-web-token')
const bcrypt = require('bcrypt')
const { UserInputError } = require('apollo-server')
const Player = require('../models/player')
const User = require('../models/user')
const roundToOneDecimal = require('../utils/round-to-one-decimal')
const reduceStats = require('../utils/reduce-stats')

require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET

const resolvers = {
  Query: {
    playerCount: () => Player.collection.countDocuments(),
    allPlayers: async () => {
      const players = await Player.find({})
      return players
    },
    findPlayer: async (root, args) => {
      const player = await Player.findOne({
        playerId: args.playerId,
      })
      return player
    },
    findPlayers: async (root, args) => {
      const players = await Player.find(args)
      return players
    },
    getSingleStatsInRange: async (root, args) => {
      const { playerId, numOfGames } = args
      const player = await Player.findOne({ playerId })
      player.stats = reduceStats(player, numOfGames)
      return player
    },
    getStatsInRange: async (root, args) => {
      const { playerIds, numOfGames } = args
      const players = await Player.find({ playerId: { $in: playerIds } })
      const newPlayers = []
      for (const player of players) {
        player.stats = reduceStats(player, numOfGames)
        newPlayers.push(player)
      }
      return newPlayers
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const { username, password, email } = args
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      })
      if (existingUser) {
        throw new UserInputError('username or email is taken')
      }

      if (!password || password.length < 6) {
        throw new UserInputError('invalid password')
      }

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new User({
        username,
        email,
        passwordHash,
      })

      const savedUser = await user.save()
      return savedUser
    },
  },
  Player: {
    fullName: root => `${root.firstName} ${root.lastName}`,
  },
  Stat: {
    faceOffPct: root => {
      if (root.faceoffTaken === 0) return 0
      return roundToOneDecimal(root.faceOffWins / root.faceoffTaken)
    },
    shotPct: root => {
      if (root.shots === 0) return 0
      return roundToOneDecimal(root.goals / root.shots)
    },
    savePct: root => {
      if (root.saves === 0) return 0
      return roundToOneDecimal(root.goals / root.saves)
    },
    points: root => root.goals + root.assists,
    numOfGames: async root => {
      const player = await Player.findOne({ 'boxscores._id': root._id })
      return player.boxscores.length
    },
  },
}

module.exports = resolvers
