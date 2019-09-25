const axios = require('axios')
const mongoose = require('mongoose')
const Conference = require('../models/conference')
const Division = require('../models/division')
const Team = require('../models/team')
const Player = require('../models/player')
const SkaterBoxscore = require('../models/skater-boxscore')
const GoalieBoxscore = require('../models/goalie-boxscore')
const SkaterStats = require('../models/skater-stats')
const GoalieStats = require('../models/goalie-stats')
const TeamStats = require('../models/team-stats')
const BestPlayers = require('../models/best-players')
const User = require('../models/user')
const config = require('../utils/config')

/* eslint-disable no-unused-vars */

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const deleteLeague = async () => {
  await Conference.deleteMany({})
  await Division.deleteMany({})
  await Team.deleteMany({})
  await Player.deleteMany({})
  await SkaterBoxscore.deleteMany({})
  await GoalieBoxscore.deleteMany({})
  await SkaterStats.deleteMany({})
  await GoalieStats.deleteMany({})
  await TeamStats.deleteMany({})
  await BestPlayers.deleteMany({})

  const users = await User.find({})
  for (const user of users) {
    user.favoritePlayers = []
    await user.save()
  }
}

const deletePlayers = async () => {
  await Player.deleteMany({})
}

const deletePlayerBoxscores = async () => {
  await SkaterBoxscore.deleteMany({})
  await Player.updateMany({}, { $set: { boxscores: [] } })
  // const players = await Player.find({ boxscoreType: 'SkaterBoxsore' })
  // for (const player of players) {
  //   player.boxscores = []
  //   await player.save()
  // }
}

const deleteGoalieBoxscores = async () => {
  await GoalieBoxscore.deleteMany({})
  const players = await Player.find({ boxscoreType: 'GoalieBoxsore' })
  for (const player of players) {
    player.boxscores = []
    await player.save()
  }
}

const deletePlayerStats = async () => {
  await SkaterStats.deleteMany({})
  const players = await Player.find({ statType: 'SkaterStats' })
  for (const player of players) {
    player.stats = []
    await player.save()
  }
}

const deleteGoalieStats = async () => {
  await GoalieStats.deleteMany({})
  const players = await Player.find({ statType: 'GoalieStats' })
  for (const player of players) {
    player.stats = []
    await player.save()
  }
}

const deleteTeamStats = async () => {
  await TeamStats.deleteMany({})
  const teams = await Team.find({})
  for (const team of teams) {
    team.stats = []
    await team.save()
  }
}

const addPlayerBoxscore = async () => {
  const boxscore = new SkaterBoxscore({
    player: '5d287460c19785048cb047e9',
    assists: 2,
    goals: 1,
  })

  const savedBoxscore = await boxscore.save()

  const skater = await Player.findOne({ _id: '5d287460c19785048cb047e9' })
  skater.boxscores = skater.boxscores.concat(savedBoxscore._id)
  const savedSkater = await skater.save()
  console.log(savedSkater)
}

const addGoalieBoxscore = async () => {
  const boxscore = new GoalieBoxscore({
    player: '5d287460c19785048cb047eb',
    saves: 30,
    shotsAgainst: 31,
  })

  const savedBoxscore = await boxscore.save()

  const goalie = await Player.findOne({ _id: '5d287460c19785048cb047eb' })
  goalie.boxscores = goalie.boxscores.concat(savedBoxscore._id)
  const savedGoalie = await goalie.save()
  console.log(savedGoalie)
}

const addPlayerStats = async () => {
  const stats = new SkaterStats({
    player: '5d287460c19785048cb047e9',
    assists: 2,
    goals: 1,
  })

  const savedStats = await stats.save()

  const skater = await Player.findOne({ _id: '5d287460c19785048cb047e9' })
  skater.stats = skater.stats.concat(savedStats._id)
  const savedSkater = await skater.save()
  console.log(savedSkater)
}

const addGoalieStats = async () => {
  const stats = new GoalieStats({
    player: '5d287460c19785048cb047eb',
    saves: 30,
    shotsAgainst: 31,
  })

  const savedStats = await stats.save()

  const goalie = await Player.findOne({ _id: '5d287460c19785048cb047eb' })
  goalie.stats = goalie.stats.concat(savedStats._id)
  const savedGoalie = await goalie.save()
  console.log(savedGoalie)
}

const populatePlayerBoxscores = async () => {
  const player = await Player.findOne({
    _id: '5d287460c19785048cb047e9',
  }).populate('boxscores')
  console.log(player)
}

const populatePlayerStats = async () => {
  const player = await Player.findOne({
    _id: '5d287460c19785048cb047eb',
  }).populate('stats')
  console.log(player)
}

const populatePlayer = async () => {
  const boxscore = await SkaterBoxscore.findOne({
    _id: '5d2874f7cbfe1a2a50e6a738',
  }).populate('player')
  console.log(boxscore)
}

const generatePlayerLinks = async () => {
  const players = await Player.find({})

  for (const player of players) {
    await player.updateOne({
      $set: {
        siteLink: `${player.firstName} ${player.lastName}`
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s/, '-')
          .toLowerCase(),
      },
    })
  }
}

const generateTeamLinks = async () => {
  const teams = await Team.find({})

  for (const team of teams) {
    await team.updateOne({
      siteLink: team.name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s/, '-')
        .replace(/\s/, '-')
        .toLowerCase(),
    })
  }
}

const deleteAllStarGames = async () => {
  const boxscores = await GoalieBoxscore.deleteMany({
    gamePk: { $gte: 2018029999 },
  })
}

const addTeamsToBoxscores = async () => {
  const gamePks = await SkaterBoxscore.find().distinct('gamePk')
  for (const gamePk of gamePks) {
    const response = await axios.get(
      `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/boxscore`
    )
    const homeTeam = await Team.findOne({
      teamId: response.data.teams.home.team.id,
    })

    const awayTeam = await Team.findOne({
      teamId: response.data.teams.away.team.id,
    })

    await GoalieBoxscore.updateMany(
      { gamePk },
      { homeTeam: homeTeam._id, awayTeam: awayTeam._id }
    )

    console.log(gamePk)
  }
}

const addNationalities = async () => {
  const players = await Player.find({})
  for (const player of players) {
    if (!player.nationality) {
      player.nationality = player.birthCountry
      await player.save()
    }
  }
}

const addPointsToBoxscores = async () => {
  await SkaterBoxscore.updateMany(
    {},
    { $set: { points: { $add: ['$assists', '$goals'] } } }
  )
}

// deleteLeague().then(() => mongoose.connection.close())
// deletePlayers().then(() => mongoose.connection.close())
// deletePlayerBoxscores().then(() => mongoose.connection.close())
// deleteGoalieBoxscores().then(() => mongoose.connection.close())
// deletePlayerStats().then(() => mongoose.connection.close())
// deleteGoalieStats().then(() => mongoose.connection.close())
// deleteTeamStats().then(() => mongoose.connection.close())
// addPlayerBoxscore().then(() => mongoose.connection.close())
// addGoalieBoxscore().then(() => mongoose.connection.close())
// addPlayerStats().then(() => mongoose.connection.close())
// addGoalieStats().then(() => mongoose.connection.close())
// populatePlayerBoxscores().then(() => mongoose.connection.close())
// populatePlayerStats().then(() => mongoose.connection.close())
// populatePlayer().then(() => mongoose.connection.close())
// generatePlayerLinks().then(() => mongoose.connection.close())
// generateTeamLinks().then(() => mongoose.connection.close())
// deleteAllStarGames().then(() => mongoose.connection.close())
// addTeamsToBoxscores().then(() => mongoose.connection.close())
// addNationalities().then(() => mongoose.connection.close())
// addPointsToBoxscores().then(() => mongoose.connection.close())
