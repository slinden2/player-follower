const axios = require('axios')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { UserInputError, AuthenticationError } = require('apollo-server')
const { format } = require('date-fns')
const Player = require('../models/player')
require('../models/skater-boxscore') // needed for field population
require('../models/goalie-boxscore') // needed for field population
require('../models/team-stats') // needed for field population
require('../models/conference') // needed for field population
require('../models/division') // needed for field population
require('../models/game') // needed for field population
const Team = require('../models/team')
const User = require('../models/user')
const Token = require('../models/token')
const SkaterBoxscore = require('../models/skater-boxscore')
const Goal = require('../models/goal')
const validateRecaptcha = require('../utils/validate-recaptcha')
const {
  bestPlayersAggregate,
  favoritePlayersAggregate,
  seasonStatsAggregate,
  teamProfileAggregate,
  teamStandingsAggregate,
  bestTeamsAggregate,
} = require('./pipelines')
const {
  convertSecsToMin,
  roundToDecimal,
  getSortField,
  getPositionData,
  periodNumberToString,
} = require('../utils/generic-helpers')
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

      const goals = await Goal.find(
        { player: playerJSON.id },
        { game: 1, strength: 1, periodNumber: 1, periodTime: 1, coordinates: 1 }
      ).populate([
        {
          path: 'game',
          model: 'Game',
          select: 'awayTeam homeTeam gameDate',
          populate: [
            {
              path: 'awayTeam.team',
              model: 'Team',
              select: 'abbreviation',
            },
            {
              path: 'homeTeam.team',
              model: 'Team',
              select: 'abbreviation',
            },
          ],
        },
      ])

      const goalsJSON = goals.map(goal => goal.toJSON())

      const goalObjects = goalsJSON.map(goal => {
        const { game, ...props } = goal
        return {
          ...props,
          gameDate: format(game.gameDate, 'YYYY/MM/DD'),
          awayTeam: game.awayTeam.team,
          homeTeam: game.homeTeam.team,
        }
      })

      playerJSON.goals = goalObjects

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
                  milestone.highlight.playbacks.length - 1
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
        bestPlayersAggregate(
          args.numOfGames,
          args.positionFilter,
          args.teamFilter,
          args.nationalityFilter,
          getSortField(args.sortBy)
        )
      )
      return players
    },
    BestTeams: async (root, args) => {
      const teams = await Team.aggregate(bestTeamsAggregate(args.numOfGames))
      return teams
    },
    FavoritePlayers: async (root, args, ctx) => {
      if (!ctx.currentUser) return []
      const players = await Player.aggregate(
        favoritePlayersAggregate(
          ctx.currentUser.favoritePlayers,
          args.numOfGames,
          args.positionFilter,
          args.teamFilter,
          args.nationalityFilter,
          getSortField(args.sortBy)
        )
      )
      return players.filter(player =>
        ctx.currentUser.favoritePlayers.includes(player._id)
      )
    },
    GetCumulativeStats: async (root, args) => {
      try {
        const sortByEnum = args.sortBy
        const sortDirEnum = args.sortDir

        let sortBy = getSortField(sortByEnum)
        const sortDir = sortDirEnum === 'DESC' ? '-' : ''
        const offset = args.offset

        const players = await Player.aggregate(
          seasonStatsAggregate(
            args.teamFilter,
            args.positionFilter,
            args.nationalityFilter,
            sortBy,
            sortDir,
            offset
          )
        )

        return players
      } catch ({ name, message }) {
        console.log(`${name}: ${message}`)
      }
    },
    Standings: async () => {
      const standings = await Team.aggregate(teamStandingsAggregate())
      return standings
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

      const team = await Team.aggregate(teamProfileAggregate(siteLink))

      return team[0]
    },
    GetLastUpdate: async () => {
      const score = await SkaterBoxscore.find({}, { _id: 1 })
        .sort({
          $natural: -1,
        })
        .limit(1)

      return { date: score[0]._id.getTimestamp().toISOString() }
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const { username, password, email, recaptcha } = args

      await validateRecaptcha(recaptcha)

      const existingUser = await User.findOne({
        $or: [{ usernameLower: username.toLowerCase() }, { email }],
      })
      if (existingUser) {
        throw new UserInputError('Username or email is taken.')
      }

      validatePassword(password)

      if (!username || !email) {
        throw new UserInputError(
          'You must provide a valid username and an email address.'
        )
      }

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new User({
        username,
        usernameLower: username.toLowerCase(),
        email: email.toLowerCase(),
        passwordHash,
        isVerified: false,
      })

      const verificationToken = new Token({
        userId: user._id,
        token: jwt.sign({ userId: user._id }, JWT_SECRET),
      })
      const savedToken = await verificationToken.save()

      const savedUser = await user.save()

      sendVerificationEmail(user.email, savedToken.token)

      return savedUser
    },
    verifyUser: async (root, args) => {
      const decodedUser = jwt.verify(args.token, JWT_SECRET)
      const token = await Token.findOne({ userId: decodedUser.userId })

      if (!token) {
        throw new AuthenticationError('Invalid or expired token.')
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
      const { password } = args
      const usernameLower = args.username.toLowerCase()

      const user = await User.findOne({
        $or: [{ usernameLower }, { email: usernameLower }],
      })

      const passwordCorrect =
        user === null
          ? false
          : await bcrypt.compare(password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        throw new UserInputError('Invalid username or password')
      }

      if (!user.isVerified) {
        throw new AuthenticationError('Account has not been activated.')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      const token = jwt.sign(userForToken, JWT_SECRET)
      return { value: token }
    },
    forgotPassword: async (root, args) => {
      const { email } = args
      const user = await User.findOne({ email })

      if (!user) {
        throw new UserInputError('Invalid email address')
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
        throw new UserInputError('Invalid old password')
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
      const { name, email, subject, message, recaptcha } = args
      const username = currentUser && currentUser.username

      await validateRecaptcha(recaptcha)

      await sendContactFormEmail(name, email, subject, message, username)

      return true
    },
    followPlayer: async (root, args, ctx) => {
      const { currentUser } = ctx
      if (!currentUser) {
        throw new AuthenticationError('You must be logged in')
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
        throw new UserInputError('Invalid player id')
      }

      if (currentUser.favoritePlayers.includes(id)) {
        if (followType === 'FOLLOW') {
          throw new UserInputError('You already follow this player.')
        }
      } else {
        if (followType === 'UNFOLLOW') {
          throw new UserInputError('You are not following this player.')
        }
      }

      action[followType]()
      await currentUser.save()

      return player.toJSON()
    },
  },
  Player: {
    fullName: root => `${root.firstName} ${root.lastName}`,
    birthDate: root => format(root.birthDate, 'D MMM YYYY'),
  },
  Stats: {
    shotPct: root => {
      if (root.shots === 0) return 0
      return roundToDecimal(root.goals / root.shots)
    },
    savePct: root => {
      if (root.saves === 0) return 0
      return roundToDecimal(root.goals / root.saves)
    },
    pointsPerGame: root =>
      roundToDecimal((root.goals + root.assists) / root.gamesPlayed),
    gameDate: root => root.gameDate.toISOString(),
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
    pointsPerGame: root => roundToDecimal(root.pointsPerGame),
    shotPct: root => roundToDecimal(root.shotPct),
    timeOnIcePerGame: root => convertSecsToMin(root.timeOnIcePerGame),
    powerPlayTimeOnIcePerGame: root =>
      convertSecsToMin(root.powerPlayTimeOnIcePerGame),
    shortHandedTimeOnIcePerGame: root =>
      convertSecsToMin(root.shortHandedTimeOnIcePerGame),
    faceOffPct: root => roundToDecimal(root.faceOffPct),
  },
  Position: {
    code: root => root,
    description: root => getPositionData(root).desc,
    abbreviation: root => getPositionData(root).abbr,
  },
  Standings: {
    pointPct: root => roundToDecimal(root.pointPct),
    goalsForPerGame: root => roundToDecimal(root.goalsForPerGame),
    goalsAgainstPerGame: root => roundToDecimal(root.goalsAgainstPerGame),
    ppPct: root => roundToDecimal(root.ppPct),
    pkPct: root => roundToDecimal(root.pkPct),
    shotsForPerGame: root => roundToDecimal(root.shotsForPerGame),
    shotsAgainstPerGame: root => roundToDecimal(root.shotsAgainstPerGame),
    faceOffWinPct: root => roundToDecimal(root.faceOffWinPct),
    hitsForPerGame: root => roundToDecimal(root.hitsForPerGame),
    hitsAgainstPerGame: root => roundToDecimal(root.hitsAgainstPerGame),
    homeRecord: root =>
      `${root.winsHome}-${root.lossesHome}-${root.otLossesHome}`,
    awayRecord: root =>
      `${root.winsAway}-${root.lossesAway}-${root.otLossesAway}`,
  },
  Goal: {
    periodNumber: root => periodNumberToString(root.periodNumber),
    periodTime: root => convertSecsToMin(root.periodTime),
  },
}

module.exports = resolvers
