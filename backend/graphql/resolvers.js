const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { UserInputError, AuthenticationError } = require('apollo-server')
const { format } = require('date-fns')
const Player = require('../models/player')
require('../models/team-stats') // needed for field population
require('../models/conference') // needed for field population
require('../models/division') // needed for field population
require('../models/linescore') // needed for field population
const Game = require('../models/game')
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
  teamStandingsAggregate,
  bestTeamsAggregate,
} = require('./pipelines')
const profileAggregate = require('./profile-aggregate')
const milestonePipeline = require('../pipelines/milestonePipeline')
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
    AllPlayers: async () => {
      const players = await Player.find({})
      return players
    },
    GetPlayer: async (root, args) => {
      const player = await Player.aggregate(
        profileAggregate(args.siteLink, args.type)
      )
      return player[0]
    },
    GetMilestones: async (root, args) => {
      const { playerId, gamePks } = args
      const goals = await Goal.aggregate(milestonePipeline(playerId, gamePks))
      return goals
    },
    GetGameRecaps: async (root, args) => {
      // use gamePk filter only if provided
      const gamePk = args.gamePk ? { gamePk: args.gamePk } : {}
      const team = args.teamId
        ? {
            $or: [
              { 'homeTeam.team': args.teamId },
              { 'awayTeam.team': args.teamId },
            ],
          }
        : {}

      const games = await Game.find({
        ...gamePk,
        ...team,
      }).populate([
        {
          path: 'awayTeam.team',
          model: 'Team',
          select: 'abbreviation name siteLink',
        },
        {
          path: 'homeTeam.team',
          model: 'Team',
          select: 'abbreviation name siteLink',
        },
      ])

      const getHighLightObj = (data, type) => ({
        gamePk: data.gamePk,
        gameDate: data.gameDate,
        awayTeam: data.awayTeam.team,
        awayScore: data.awayTeam.score,
        homeTeam: data.homeTeam.team,
        homeScore: data.homeTeam.score,
        ...data[type],
        highlight: data[type].playbacks.find(playback =>
          playback.name.startsWith('FLASH_1800')
        ),
      })

      const gameRecaps = games.map(game => {
        const gameJSON = game.toJSON()
        return {
          gameCondensed: getHighLightObj(gameJSON, 'gameCondensed'),
          gameRecap: getHighLightObj(gameJSON, 'gameRecap'),
        }
      })

      return gameRecaps
    },
    FindByName: async (root, args) => {
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
    BestGoalies: async (root, args) => {
      const goalies = await Player.aggregate(
        bestPlayersAggregate(
          args.numOfGames,
          'GOALIE',
          args.teamFilter,
          args.nationalityFilter,
          getSortField(args.sortBy)
        )
      )
      return goalies
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
            args.positionFilter,
            args.teamFilter,
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
      const team = await Team.aggregate(profileAggregate(args.siteLink, 'team'))
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
    CreateUser: async (root, args) => {
      const { username, password, email, recaptcha } = args
      // Recaptcha returns always success in development and testing envs.
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
      // Omit verification email when testing
      if (process.env.NODE_ENV !== 'test') {
        sendVerificationEmail(user.email, savedToken.token)
      }
      return savedUser
    },
    VerifyUser: async (root, args) => {
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
    CancelUser: async (root, args) => {
      const decodedUser = jwt.verify(args.token, JWT_SECRET)
      await Token.deleteOne({ userId: decodedUser.userId })
      const user = await User.findOneAndRemove({ _id: decodedUser.userId })
      return user
    },
    Login: async (root, args) => {
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
    ForgotPassword: async (root, args) => {
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
    FollowPlayer: async (root, args, ctx) => {
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
    savePct: root => roundToDecimal(root.savePct),
    powerPlaySavePct: root => roundToDecimal(root.powerPlaySavePct),
    shortHandedSavePct: root => roundToDecimal(root.shortHandedSavePct),
    goalsAgainstAverage: root => roundToDecimal(root.goalsAgainstAverage),
    savesPerGame: root => roundToDecimal(root.savesPerGame),
    shotsAgainstPerGame: root => roundToDecimal(root.shotsAgainstPerGame),
    winPct: root => roundToDecimal(root.winPct),
    goalsAgainst: root => root.shotsAgainst - root.saves,
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
  Linescore: {
    gameDate: root => root.gameDate.toISOString(),
    record: root => `${root.wins}-${root.losses}-${root.otLosses}`,
    ppPct: root => roundToDecimal(root.ppPct),
    pkPct: root => roundToDecimal(root.pkPct),
    goalDiff: root => root.goalsFor - root.goalsAgainst,
  },
  Goal: {
    periodNumber: root => periodNumberToString(root.periodNumber),
    periodTime: root => convertSecsToMin(root.periodTime),
  },
  PlayerMilestone: {
    gameDate: root => root.gameDate.toISOString(),
    periodNumber: root => periodNumberToString(root.periodNumber),
    periodTime: root => convertSecsToMin(root.periodTime),
  },
  GameRecap: {
    gameDate: root => root.gameDate.toISOString(),
  },
}

module.exports = resolvers
