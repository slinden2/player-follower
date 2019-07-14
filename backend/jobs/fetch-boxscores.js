const axios = require('axios')
const mongoose = require('mongoose')
const {
  convertFtToCm,
  convertLbsToKg,
  isDuplicate,
  convertMMSStoSec,
} = require('./fetch-helpers')
const Player = require('../models/player')
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

  const players = await Player.find({ playerId: { $in: playerIds } })

  const playerIdsInDb = players.map(player => player.playerId)
  const playerIdsNotInDb = playerIds.filter(
    playerId => !playerIdsInDb.includes(playerId)
  )
}

const fetchGames = async date => {
  // try {
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
  // } catch ({ name, message }) {
  // console.log('Error in fetchGames')
  // console.log(`Fetching games for the date ${date}`)
  // console.log(`${name}: ${message}`)
  // }
}

fetchGames('2019-01-09').then(() => mongoose.connection.close())
