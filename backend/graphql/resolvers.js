const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { UserInputError, AuthenticationError } = require('apollo-server')
const Player = require('../models/player')
require('../models/skater-boxscore') // needed for populate player
require('../models/goalie-boxscore') // needed for populate player
require('../models/team')
const User = require('../models/user')
const Token = require('../models/token')
const BestPlayers = require('../models/best-players')
const SkaterStats = require('../models/skater-stats')
const roundToDecimal = require('../utils/round-to-decimal')
const getSortField = require('../utils/get-sort-field')
const {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} = require('../utils/email-sender')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const JWT_SECRET = process.env.JWT_SECRET

const resolvers = {
  Query: {
    me: async (root, args, ctx) => {
      return ctx.currentUser
    },
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
    findByName: async (root, args) => {
      let players
      // match many search strings
      if (args.searchString.split(' ').length > 1) {
        players = await Player.find(
          { $text: { $search: args.searchString } },
          { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } })

        // match firstname or lastname
      } else {
        const searchString = new RegExp(args.searchString, 'ig')
        players = await Player.find({
          $or: [{ firstName: searchString }, { lastName: searchString }],
        })
      }

      return players.map(player => player.toJSON())
    },
    bestPlayers: async () => {
      const bestPlayers = await BestPlayers.find({})
        .sort({ _id: -1 })
        .limit(1)

      return {
        oneGame: JSON.parse(bestPlayers[0].oneGame).slice(0, 15),
        fiveGames: JSON.parse(bestPlayers[0].fiveGames).slice(0, 15),
        tenGames: JSON.parse(bestPlayers[0].tenGames).slice(0, 15),
      }
    },
    favoritePlayers: async (root, args, ctx) => {
      if (!ctx.currentUser) {
        return { oneGame: [], fiveGames: [], tenGames: [] }
      }

      const bestPlayers = await BestPlayers.find({})
        .sort({ _id: -1 })
        .limit(1)

      const oneGame = JSON.parse(bestPlayers[0].oneGame).filter(player =>
        ctx.currentUser.favoritePlayers.includes(player.id)
      )

      const fiveGames = JSON.parse(bestPlayers[0].fiveGames).filter(player =>
        ctx.currentUser.favoritePlayers.includes(player.id)
      )

      const tenGames = JSON.parse(bestPlayers[0].tenGames).filter(player =>
        ctx.currentUser.favoritePlayers.includes(player.id)
      )

      return { oneGame, fiveGames, tenGames }
    },
    GetCumulativeStats: async (root, args) => {
      try {
        const sortByEnum = args.sortBy
        const sortDirEnum = args.sortDir

        let sortBy = getSortField(sortByEnum)
        const sortDir = sortDirEnum === 'DESC' ? '-' : ''

        console.log(sortBy)
        console.log(sortDir)

        const allStatsAggregate = await SkaterStats.aggregate()
          .project({
            gamesPlayed: 1,
            goals: 1,
            assists: 1,
            points: { $add: ['$goals', '$assists'] },
            plusMinus: 1,
            penaltyMinutes: 1,
            pointsPerGame: {
              $divide: [{ $add: ['$goals', '$assists'] }, '$gamesPlayed'],
            },
            gameWinningGoals: 1,
            overTimeGoals: 1,
            powerPlayGoals: 1,
            powerPlayAssists: 1,
            powerPlayPoints: { $add: ['$powerPlayGoals', '$powerPlayAssists'] },
            shortHandedGoals: 1,
            shortHandedAssists: 1,
            shortHandedPoints: {
              $add: ['$shortHandedGoals', '$shortHandedAssists'],
            },
            shots: 1,
            player: 1,
          })
          .sort(`field ${sortDir}${sortBy}`)
          .skip(args.offset)
          .limit(25)

        const allStats = await Player.populate(allStatsAggregate, {
          path: 'player',
          model: 'Player',
          select: 'firstName lastName primaryPosition',
          populate: {
            path: 'currentTeam',
            model: 'Team',
            select: 'abbreviation',
          },
        })

        const cumulativeStats = allStats.map(entry => {
          return {
            firstName: entry.player.firstName,
            lastName: entry.player.lastName,
            team: entry.player.currentTeam.abbreviation,
            position: entry.player.primaryPosition,
            gamesPlayed: entry.gamesPlayed,
            goals: entry.goals,
            assists: entry.assists,
            points: entry.points,
            plusMinus: entry.plusMinus,
            penaltyMinutes: entry.penaltyMinutes,
            pointsPerGame: entry.pointsPerGame,
            gameWinningGoals: entry.gameWinningGoals,
            overTimeGoals: entry.overTimeGoals,
            powerPlayGoals: entry.powerPlayGoals,
            powerPlayPoints: entry.powerPlayPoints,
            shortHandedGoals: entry.shortHandedGoals,
            shortHandedPoints: entry.shortHandedPoints,
            shots: entry.shots,
          }
        })

        return cumulativeStats
      } catch ({ name, message }) {
        console.log(`${name}: ${message}`)
      }
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

      if (!username || !email) {
        throw new UserInputError(
          'you must provide a valid username and an email address'
        )
      }

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new User({
        username,
        email,
        passwordHash,
        isVerified: false,
      })

      const verificationToken = new Token({
        userId: user._id,
        token: jwt.sign({ userId: user._id }, JWT_SECRET),
      })
      const savedToken = await verificationToken.save()

      const savedUser = await user.save()

      await sendVerificationEmail(user.email, savedToken.token)

      return savedUser
    },
    verifyUser: async (root, args) => {
      const decodedUser = jwt.verify(args.token, JWT_SECRET)
      const token = await Token.findOne({ userId: decodedUser.userId })

      if (!token) {
        throw new AuthenticationError('invalid or expired token')
      }

      const user = await User.findOneAndUpdate(
        { _id: token.userId },
        { isVerified: true },
        { new: true }
      )

      return user
    },
    cancelUser: async (root, args) => {
      const decodedUser = jwt.verify(args.token, JWT_SECRET)
      await Token.deleteOne({ userId: decodedUser.userId })
      const user = await User.findOneAndRemove({ _id: decodedUser.userId })
      return user
    },
    login: async (root, args) => {
      const { username, password } = args
      const user = await User.findOne({
        $or: [{ username }, { email: username }],
      })

      const passwordCorrect =
        user === null
          ? false
          : await bcrypt.compare(password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        throw new UserInputError('invalid username or password')
      }

      if (!user.isVerified) {
        throw new AuthenticationError('account not activated')
      }

      const userForToken = {
        username,
        id: user._id,
      }

      const token = jwt.sign(userForToken, JWT_SECRET)
      return { value: token }
    },
    forgotPassword: async (root, args) => {
      const { email } = args
      const user = await User.findOne({ email })

      if (!user) {
        throw new UserInputError('invalid email address')
      }

      const verificationToken = new Token({
        userId: user._id,
        token: jwt.sign({ userId: user._id }, JWT_SECRET),
      })

      const savedToken = await verificationToken.save()
      await sendForgotPasswordEmail(user.email, savedToken.token)
    },
    setNewPassword: async (root, args) => {
      const decodedUser = jwt.verify(args.token, JWT_SECRET)
      const token = await Token.findOne({ userId: decodedUser.userId })
      if (!token) {
        throw new AuthenticationError('invalid or expired token')
      }

      if (!args.password || args.password.length < 6) {
        throw new UserInputError('invalid password')
      }

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)
      const newUser = await User.findOneAndUpdate(
        { _id: token.userId },
        { passwordHash }
      )

      return newUser
    },
    changePassword: async (root, args, ctx) => {
      if (args.password && ctx.currentUser) {
        if (!args.password || args.password.length < 6) {
          throw new UserInputError('invalid password')
        }
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(args.password, saltRounds)
        const newUser = await User.findOneAndUpdate(
          { _id: ctx.currentUser._id },
          { passwordHash }
        )
        return newUser
      }
    },
    followPlayer: async (root, args, ctx) => {
      const { currentUser } = ctx
      if (!currentUser) {
        throw new AuthenticationError('you must be logged in')
      }

      const { id, followType } = args

      const action = {
        FOLLOW: () =>
          (currentUser.favoritePlayers = currentUser.favoritePlayers.concat(
            id
          )),
        UNFOLLOW: () =>
          (currentUser.favoritePlayers = currentUser.favoritePlayers.filter(
            _id => _id.toString() !== id
          )),
      }

      const player = await Player.findOne({ _id: id })

      if (!player) {
        throw new UserInputError('invalid player id')
      }

      if (currentUser.favoritePlayers.includes(id)) {
        if (followType === 'FOLLOW') {
          throw new UserInputError('you already follow this player')
        }
      } else {
        if (followType === 'UNFOLLOW') {
          throw new UserInputError('you are not following this player')
        }
      }

      action[followType]()
      await currentUser.save()

      return player.toJSON()
    },
  },
  Player: {
    fullName: root => `${root.firstName} ${root.lastName}`,
  },
  Stat: {
    faceOffPct: root => {
      if (root.faceoffTaken === 0) return 0
      return roundToDecimal(root.faceOffWins / root.faceoffTaken, 1)
    },
    shotPct: root => {
      if (root.shots === 0) return 0
      return roundToDecimal(root.goals / root.shots, 1)
    },
    savePct: root => {
      if (root.saves === 0) return 0
      return roundToDecimal(root.goals / root.saves, 1)
    },
    points: root => root.goals + root.assists,
    numOfGames: async root => {
      const player = await Player.findOne({ 'boxscores._id': root._id })
      return player.boxscores.length
    },
  },
  CumulativeStats: {
    fullName: root => `${root.firstName} ${root.lastName}`,
    pointsPerGame: root => roundToDecimal(root.pointsPerGame, 2),
  },
}

module.exports = resolvers
