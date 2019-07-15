const axios = require('axios')
const mongoose = require('mongoose')
const { isDuplicate, convertMMSStoSec } = require('./fetch-helpers')
const Player = require('../models/player')
const SkaterBoxscore = require('../models/skater-boxscore')
const GoalieBoxscore = require('../models/goalie-boxscore')
const config = require('../utils/config')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const gamesUrl = date =>
  `https://statsapi.web.nhl.com/api/v1/schedule?date=${date}`
const boxscoreUrl = gamePk =>
  `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/boxscore`

const removeScratches = (skaters, scratches) => {
  return skaters.filter(playerId => !scratches.includes(playerId))
}

const handlePlayer = async (playerInDb, stats, gamePk, gameDate, isGoalie) => {
  if (!isGoalie) {
    stats.evenTimeOnIce = convertMMSStoSec(stats.evenTimeOnIce)
    stats.powerPlayTimeOnIce = convertMMSStoSec(stats.powerPlayTimeOnIce)
    stats.shortHandedTimeOnIce = convertMMSStoSec(stats.shortHandedTimeOnIce)
    stats.faceOffsTaken = stats.faceoffTaken
  } else {
    stats.shotsAgainst = stats.shots
    stats.penaltyMinutes = stats.pim
  }

  stats.timeOnIce = convertMMSStoSec(stats.timeOnIce)
  const boxscore = { gamePk, gameDate, player: playerInDb._id, ...stats }

  try {
    if (isDuplicate(playerInDb, gamePk)) {
      throw new Error('Duplicate internal game id!')
    }

    let savedBoxscore
    isGoalie
      ? (savedBoxscore = await new GoalieBoxscore(boxscore).save())
      : (savedBoxscore = await new SkaterBoxscore(boxscore).save())

    playerInDb.boxscores = playerInDb.boxscores.concat(savedBoxscore._id)
    await playerInDb.save()
  } catch ({ name, message }) {
    console.log(
      `Error while saving a boxscore for ${playerInDb.firstName} ${
        playerInDb.lastName
      } ${playerInDb._id}. | gamePk: ${gamePk}`
    )
    console.log(`${name}: ${message}`)
  }
}

const fetchBoxscore = async (gamePk, gameDate) => {
  const { data } = await axios.get(boxscoreUrl(gamePk))
  const { teams } = data

  const skatersHome = removeScratches(teams.home.skaters, teams.home.scratches)
  const skatersAway = removeScratches(teams.away.skaters, teams.away.scratches)
  const goaliesHome = removeScratches(teams.home.goalies, teams.home.scratches)
  const goaliesAway = removeScratches(teams.away.goalies, teams.away.scratches)

  const playerIds = [
    ...skatersHome,
    ...skatersAway,
    ...goaliesHome,
    ...goaliesAway,
  ]

  const playersInDb = await Player.find({
    playerId: { $in: playerIds },
  }).populate('boxscores', { gamePk: 1 })

  const playerIdsInDb = playersInDb.map(player => player.playerId)
  const playerIdsNotInDb = playerIds.filter(
    playerId => !playerIdsInDb.includes(playerId)
  )

  // In production this should be unneccesary. The players will be fetched and saved before boxscores
  // so when fetching boxscores all players should be found.
  console.log(
    `gamePk: ${gamePk} | gameDate: ${gameDate} | playerIds not found in db: ${playerIdsNotInDb}`
  )

  const fetchedPlayers = { ...teams.home.players, ...teams.away.players }

  for (const player of playersInDb) {
    const { stats } = fetchedPlayers[`ID${player.playerId}`]

    let playerStats
    let isGoalie
    if (stats.skaterStats) {
      playerStats = stats.skaterStats
      isGoalie = false
    } else {
      playerStats = stats.goalieStats
      isGoalie = true
    }

    await handlePlayer(player, playerStats, gamePk, gameDate, isGoalie)
  }
}

const fetchGames = async date => {
  try {
    const {
      data: { dates },
    } = await axios.get(gamesUrl(date))

    if (!dates.length) {
      throw new Error(`there are no games for the date ${date}`)
    }

    const { games } = dates[0]

    for (const game of games) {
      const { gamePk, gameDate } = game
      console.log('fetching gamepk', gamePk)
      console.log('gameDate', gameDate)
      await fetchBoxscore(gamePk, gameDate)
    }
  } catch ({ name, message }) {
    console.log('Error in fetchGames')
    console.log(`Fetching games for the date ${date}`)
    console.log(`${name}: ${message}`)
  }
}

fetchGames('2019-01-09').then(() => mongoose.connection.close())
