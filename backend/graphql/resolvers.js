const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { UserInputError, AuthenticationError } = require('apollo-server')
const axios = require('axios')
const Player = require('../models/player')
const User = require('../models/user')
const Token = require('../models/token')
const roundToOneDecimal = require('../utils/round-to-one-decimal')
const { getBestPlayers } = require('../utils/get-best-players')
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
      // const players = await Player.find({
      //   playerId: {
      //     $in: [8473512, 8471214, 8478427, 8478402, 8476453, 8477493, 8468498],
      //   },
      // })
      const players = await Player.find({})
      const playersJSON = players.map(player => player.toJSON())
      const bestPlayers1 = getBestPlayers(playersJSON, 1)
      const bestPlayers5 = getBestPlayers(playersJSON, 5)
      const bestPlayers10 = getBestPlayers(playersJSON, 10)
      return {
        oneGame: bestPlayers1,
        fiveGames: bestPlayers5,
        tenGames: bestPlayers10,
      }
    },
    favoritePlayers: async (root, args, ctx) => {
      if (!ctx.currentUser) {
        return { oneGame: [], fiveGames: [], tenGames: [] }
      }
      const players = await Player.find({
        _id: { $in: ctx.currentUser.favoritePlayers },
      })
      const playersJSON = players.map(player => player.toJSON())
      const bestPlayers1 = getBestPlayers(playersJSON, 3)
      const bestPlayers5 = getBestPlayers(playersJSON, 5)
      const bestPlayers10 = getBestPlayers(playersJSON, 10)
      return {
        oneGame: bestPlayers1,
        fiveGames: bestPlayers5,
        tenGames: bestPlayers10,
      }
    },
    cumulativeStats: async () => {
      try {
        const response = await axios.get(
          'https://api.nhle.com/stats/rest/skaters?isAggregate=false&reportType=basic&isGame=false&reportName=skatersummary&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22goals%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22assists%22,%22direction%22:%22DESC%22%7D%5D&cayenneExp=leagueId=133%20and%20gameTypeId=2%20and%20seasonId%3E=20182019%20and%20seasonId%3C=20182019'
        )
        return response.data.data
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
