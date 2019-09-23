const axios = require('axios')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { UserInputError, AuthenticationError } = require('apollo-server')
const dateFns = require('date-fns')
const Player = require('../models/player')
require('../models/skater-boxscore') // needed for field population
require('../models/goalie-boxscore') // needed for field population
require('../models/team-stats') // needed for field population
require('../models/conference') // needed for field population
require('../models/division') // needed for field population
const Team = require('../models/team')
const User = require('../models/user')
const Token = require('../models/token')
const SkaterStats = require('../models/skater-stats')
const { bestPlayersPipeline } = require('./pipelines')
const { getBestPlayers } = require('../utils/get-best-players')
const roundToDecimal = require('../utils/round-to-decimal')
const generateCumulativeStats = require('../utils/generate-cumulative-stats')
const getSortField = require('../utils/get-sort-field')
const convertSecsToMin = require('../utils/convert-secs-to-min')
const positions = require('../utils/position-codes')
const { validatePassword } = require('../utils/password-requirements')
const {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendContactFormEmail,
} = require('../utils/mailgun-email-sender')

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
      const player = await Player.findOne(args).populate([
        {
          path: 'boxscores',
          model: 'SkaterBoxscore', // TODO how to work with goalies?
          populate: {
            path: 'homeTeam awayTeam',
            model: 'Team',
            select: 'abbreviation',
          },
        },
        {
          path: 'currentTeam',
          model: 'Team',
          select: 'name abbreviation locationName siteLink',
        },
      ])

      const playerJSON = player.toJSON()

      return playerJSON
    },
    GetMilestones: async (root, args) => {
      const contentUrl = gamePk =>
        `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/content`

      const { gamePks, playerId } = args

      const contentByGame = []

      gamePks
        .slice(0, 10)
        .forEach(gamePk => contentByGame.push(axios.get(contentUrl(gamePk))))

      const responseArray = await Promise.all(contentByGame)

      // Extract goal highlights from the response array and
      // generate milestone objects
      const goals = responseArray
        .map(response =>
          response.data.media.milestones.items
            .map(item => ({
              ...item,
              gamePk: Number(response.data.link.split('/')[4]),
            }))
            .filter(
              milestone =>
                milestone.type === 'GOAL' &&
                Number(milestone.playerId) === playerId &&
                Object.keys(milestone.highlight).length
            )
            .map(milestone => ({
              gamePk: milestone.gamePk,
              title: milestone.highlight.title,
              description: milestone.highlight.description,
              blurb: milestone.highlight.blurb,
              playback:
                milestone.highlight.playbacks[
                  milestone.highlight.playbacks.length - 2
                ],
            }))
        )
        .filter(game => game.length)

      return goals
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
        )
          .populate('currentTeam', 'abbreviation')
          .sort({ score: { $meta: 'textScore' } })

        // match firstname or lastname
      } else {
        const searchString = new RegExp(args.searchString, 'ig')
        players = await Player.find({
          $or: [{ firstName: searchString }, { lastName: searchString }],
        }).populate('currentTeam', 'abbreviation')
      }

      return players.map(player => player.toJSON())
    },
    BestPlayers: async (root, args) => {
      const players = await Player.aggregate(
        bestPlayersPipeline(args.numOfGames, args.filter)
      )
      return players
    },
    favoritePlayers: async (root, args, ctx) => {
      if (!ctx.currentUser) {
        return { oneGame: [], fiveGames: [], tenGames: [] }
      }
      const players = await Player.find({
        _id: { $in: ctx.currentUser.favoritePlayers },
      }).populate([
        {
          path: 'boxscores',
          model: 'SkaterBoxscore',
        },
        {
          path: 'currentTeam',
          model: 'Team',
        },
      ])
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
    GetCumulativeStats: async (root, args) => {
      try {
        const sortByEnum = args.sortBy
        const sortDirEnum = args.sortDir

        let sortBy = getSortField(sortByEnum)
        const sortDir = sortDirEnum === 'DESC' ? '-' : ''

        const allStatsAggregate = await SkaterStats.aggregate()
          .addFields({
            points: { $add: ['$goals', '$assists'] },
            pointsPerGame: {
              $divide: [{ $add: ['$goals', '$assists'] }, '$gamesPlayed'],
            },
            powerPlayPoints: { $add: ['$powerPlayGoals', '$powerPlayAssists'] },
            shortHandedPoints: {
              $add: ['$shortHandedGoals', '$shortHandedAssists'],
            },
          })
          .sort(`field ${sortDir}${sortBy}`)
          .skip(args.offset)
          .limit(25)

        const allStats = await Player.populate(allStatsAggregate, {
          path: 'player',
          model: 'Player',
          select: 'firstName lastName primaryPosition siteLink',
          populate: {
            path: 'currentTeam',
            model: 'Team',
            select: 'abbreviation siteLink',
          },
        })

        const cumulativeStats = allStats.map(entry =>
          generateCumulativeStats(entry)
        )

        return cumulativeStats
      } catch ({ name, message }) {
        console.log(`${name}: ${message}`)
      }
    },
    Standings: async () => {
      const standingsAggregate = await Team.aggregate().project({
        name: 1,
        abbreviation: 1,
        siteLink: 1,
        conference: 1,
        division: 1,
        latestStats: { $slice: ['$stats', -1] },
      })

      const standings = await Team.populate(standingsAggregate, [
        {
          path: 'latestStats',
          model: 'TeamStats',
          select: '-seasonId -date -team',
        },
        {
          path: 'conference',
          model: 'Conference',
          select: 'name',
        },
        {
          path: 'division',
          model: 'Division',
          select: 'name',
        },
      ])

      const sortedStandings = standings
        .map(team => {
          return {
            teamName: team.name,
            teamAbbr: team.abbreviation,
            teamSiteLink: team.siteLink,
            conference: team.conference,
            division: team.division,
            ...team.latestStats[0].toJSON(),
          }
        })
        .sort((teamA, teamB) => teamB.points - teamA.points)

      return sortedStandings
    },
    GetTeams: async (root, args) => {
      const searchString = new RegExp(args.searchString, 'ig')
      const teams = await Team.find({
        $or: [{ name: searchString }, { abbreviation: searchString }],
      })

      return teams.map(team => team.toJSON())
    },
    GetTeam: async (root, args) => {
      const { siteLink } = args
      const team = await Team.findOne({ siteLink }).populate([
        {
          path: 'players',
          model: 'Player',
          select: 'firstName lastName siteLink primaryPosition stats',
          populate: {
            path: 'stats',
            model: 'SkaterStats',
          },
        },
      ])

      const newTeam = team.toJSON()

      // Correct functioning of reduce NOT TESTED!!!
      newTeam.players = newTeam.players
        .filter(
          player => player.primaryPosition !== 'G' && player.stats.length > 0
        )
        .map(player => {
          player.stats = player.stats.reduce(
            (acc, cur) => (acc.date > cur.date ? acc : cur),
            []
          )
          return player
        })

      newTeam.rosterStats = newTeam.players.map(player =>
        generateCumulativeStats(player)
      )

      return newTeam
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

      validatePassword(password)

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
      return user.toJSON()
    },
    SetNewPassword: async (root, args) => {
      const decodedUser = jwt.verify(args.token, JWT_SECRET)
      const token = await Token.findOne({ userId: decodedUser.userId })
      if (!token) {
        throw new AuthenticationError('The token is either invalid or expired.')
      }

      validatePassword(args.password)

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)
      const newUser = await User.findOneAndUpdate(
        { _id: token.userId },
        { passwordHash }
      )

      return newUser
    },
    ChangePassword: async (root, args, ctx) => {
      const passwordCorrect = await bcrypt.compare(
        args.oldPassword,
        ctx.currentUser.passwordHash
      )
      if (!passwordCorrect) {
        throw new UserInputError('Invalid old password.')
      }

      validatePassword(args.newPassword)

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.newPassword, saltRounds)
      const newUser = await User.findOneAndUpdate(
        { _id: ctx.currentUser._id },
        { passwordHash }
      )
      return newUser.toJSON()
    },
    SendContactForm: async (root, args, ctx) => {
      const { currentUser } = ctx
      const { name, email, subject, message } = args
      const username = currentUser && currentUser.username

      await sendContactFormEmail(name, email, subject, message, username)

      return true
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
    birthDate: root => dateFns.format(root.birthDate, 'D MMM YYYY'),
  },
  Stats: {
    shotPct: root => {
      if (root.shots === 0) return 0
      return roundToDecimal(root.goals / root.shots, 1)
    },
    savePct: root => {
      if (root.saves === 0) return 0
      return roundToDecimal(root.goals / root.saves, 1)
    },
    pointsPerGame: root =>
      roundToDecimal((root.goals + root.assists) / root.gamesPlayed, 2),
    gameDate: root => dateFns.format(root.gameDate, 'YYYY/MM/DD'),
    timeOnIce: root => convertSecsToMin(root.timeOnIce),
    timeOnIcePerGame: root => convertSecsToMin(root.timeOnIcePerGame),
    evenTimeOnIce: root => convertSecsToMin(root.evenTimeOnIce),
    evenTimeOnIcePerGame: root => convertSecsToMin(root.evenTimeOnIcePerGame),
    powerPlayTimeOnIce: root => convertSecsToMin(root.powerPlayTimeOnIce),
    powerPlayTimeOnIcePerGame: root =>
      convertSecsToMin(root.powerPlayTimeOnIcePerGame),
    shortHandedTimeOnIce: root => convertSecsToMin(root.shortHandedTimeOnIce),
    shortHandedTimeOnIcePerGame: root =>
      convertSecsToMin(root.shortHandedTimeOnIcePerGame),
  },
  CumulativeStats: {
    fullName: root => `${root.firstName} ${root.lastName}`,
    points: root => root.goals + root.assists,
    pointsPerGame: root => roundToDecimal(root.pointsPerGame, 2),
  },
  Position: {
    code: root => root,
    description: root => positions[root],
  },
  Standings: {
    pointPct: root => roundToDecimal(root.pointPct, 2),
    goalsForPerGame: root => roundToDecimal(root.goalsForPerGame, 2),
    goalsAgainstPerGame: root => roundToDecimal(root.goalsAgainstPerGame, 2),
    ppPct: root => roundToDecimal(root.ppPct, 2),
    pkPct: root => roundToDecimal(root.pkPct, 2),
    shotsForPerGame: root => roundToDecimal(root.shotsForPerGame, 2),
    shotsAgainstPerGame: root => roundToDecimal(root.shotsAgainstPerGame, 2),
    faceOffWinPct: root => roundToDecimal(root.faceOffWinPct, 2),
  },
}

module.exports = resolvers
