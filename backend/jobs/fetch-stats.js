const axios = require('axios')
const mongoose = require('mongoose')
const Player = require('../models/player')
const SkaterStats = require('../models/skater-stats')
const GoalieStats = require('../models/goalie-stats')
const config = require('../utils/config')
const { convertMMSStoSec } = require('./helpers/fetch-helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const baseUrl = 'https://statsapi.web.nhl.com'
const hydrateQuery = '?hydrate=stats(splits=statsSingleSeason)'

const createGoalieStats = (player, stats, seasonId) => {
  const newStats = {
    ...stats,
    timeOnIce: convertMMSStoSec(stats.timeOnIce),
    timeOnIcePerGame: convertMMSStoSec(stats.timeOnIcePerGame),
    gamesPlayed: stats.games,
    savePct: stats.savePercentage,
    evenSavePct: stats.evenStrengthSavePercentage,
    powerPlaySavePct: stats.powerPlaySavePercentage,
    shortHandedSavePct: stats.shortHandedSavePercentage,
    goalsAgainstAverage: stats.goalAgainstAverage,
    evenShotsAgainst: stats.evenShots,
    powerPlayShotsAgainst: stats.powerPlayShots,
    shortHandedShotsAgainst: stats.shortHandedShots,
  }
  newStats.player = player._id
  newStats.date = new Date().toISOString().split('T')[0]
  newStats.seasonId = seasonId

  return newStats
}

const createSkaterStats = (player, stats, seasonId) => {
  const newStats = {
    ...stats,
    gamesPlayed: stats.games,
    penaltyMinutes: stats.pim,
    powerPlayAssists: stats.powerPlayPoints - stats.powerPlayGoals,
    shortHandedAssists: stats.shortHandedPoints - stats.shortHandedGoals,
    timeOnIce: convertMMSStoSec(stats.timeOnIce),
    powerPlayTimeOnIce: convertMMSStoSec(stats.powerPlayTimeOnIce),
    evenTimeOnIce: convertMMSStoSec(stats.evenTimeOnIce),
    shortHandedTimeOnIce: convertMMSStoSec(stats.shortHandedTimeOnIce),
    timeOnIcePerGame: convertMMSStoSec(stats.timeOnIcePerGame),
    evenTimeOnIcePerGame: convertMMSStoSec(stats.evenTimeOnIcePerGame),
    powerPlayTimeOnIcePerGame: convertMMSStoSec(
      stats.powerPlayTimeOnIcePerGame
    ),
    shortHandedTimeOnIcePerGame: convertMMSStoSec(
      stats.shortHandedTimeOnIcePerGame
    ),
  }
  delete newStats.pim
  newStats.player = player._id
  newStats.date = new Date().toISOString().split('T')[0]
  newStats.seasonId = seasonId

  return newStats
}

const fetchStats = async () => {
  const players = await Player.find({})
  const playersNoStats = []
  for (const player of players) {
    console.log(
      `Fetching stats for ${player.firstName} ${player.lastName} | _id: ${
        player._id
      } | playerId: ${player.playerId}`
    )
    const response = await axios.get(baseUrl + player.link + hydrateQuery)
    if (!response.data.people[0].stats[0].splits.length) {
      console.log('The player doesn\'t have any stats available.')
      playersNoStats.push(player.playerId)
      continue
    }

    const stats = response.data.people[0].stats[0].splits[0].stat
    const seasonId = response.data.people[0].stats[0].splits[0].season

    let isGoalie = false
    if (player.primaryPosition === 'G') {
      isGoalie = true
    }

    try {
      let savedStats
      if (isGoalie) {
        const newStats = createGoalieStats(player, stats, seasonId)
        savedStats = await new GoalieStats(newStats).save()
        player.stats = player.stats.concat(savedStats._id)
        await player.save()
      } else {
        const newStats = createSkaterStats(player, stats, seasonId)
        savedStats = await new SkaterStats(newStats).save()
      }
    } catch ({ name, message }) {
      console.log(
        `An error occured while fetching stats for ${player.firstName} ${
          player.lastName
        } | _id: ${player._id} | playerId: ${player.playerId}.`
      )
      console.log(`${name}: ${message}`)
    }
  }
  console.log('Data fetch has been completed.')
  console.log(
    `No stats available for the following playerIds: ${playersNoStats}`
  )
}

console.log('Data fetch started')
fetchStats().then(() => mongoose.connection.close())
