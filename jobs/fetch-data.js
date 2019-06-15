if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const axios = require('axios')
const mongoose = require('mongoose')
const Player = require('../models/player')
const config = require('../utils/config')
const {
  convertFtToCm,
  convertLbsToKg,
  isDuplicate,
  convertMMSStoSec,
} = require('./helpers')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

// in DB games from date 9.1. - 12.1. || 12.6.2019
const gamesUrl = date =>
  `https://statsapi.web.nhl.com/api/v1/schedule?date=${date}`
const boxscoreUrl = gamePk =>
  `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/boxscore`

// const GAMES_URL = 'http://localhost:3001/games/1'
// const boxscoreUrl = (gamePk) => `http://localhost:3001/gamePks/${gamePk}`

const handlePlayer = async (playerData, gamePk) => {
  /* eslint-disable */
  const {
    id,
    currentTeam,
    primaryPosition,
    currentAge,
    ...info
  } = playerData.person
  /* eslint-enable */
  info.currentTeam = playerData.person.currentTeam.id
  info.primaryPosition = playerData.person.primaryPosition.code
  info.playerId = playerData.person.id
  info.height = convertFtToCm(info.height)
  info.weight = convertLbsToKg(info.weight)

  const {
    stats: { skaterStats },
  } = playerData
  const {
    stats: { goalieStats },
  } = playerData

  if (!skaterStats && !goalieStats) return

  if (skaterStats) {
    skaterStats.timeOnIce = convertMMSStoSec(skaterStats.timeOnIce)
    skaterStats.evenTimeOnIce = convertMMSStoSec(skaterStats.evenTimeOnIce)
    skaterStats.powerPlayTimeOnIce = convertMMSStoSec(
      skaterStats.powerPlayTimeOnIce
    )
    skaterStats.shortHandedTimeOnIce = convertMMSStoSec(
      skaterStats.shortHandedTimeOnIce
    )
  }

  if (goalieStats) {
    goalieStats.timeOnIce = convertMMSStoSec(goalieStats.timeOnIce)
    goalieStats.penaltyMinutes = goalieStats.pim
    delete goalieStats.pim
  }

  let finalStats = {}
  skaterStats
    ? (finalStats = {
      gamePk,
      date: Math.floor(new Date().getTime() / 1000),
      ...skaterStats,
    })
    : (finalStats = {
      gamePk,
      date: Math.floor(new Date().getTime() / 1000),
      ...goalieStats,
    })
  const playerInDb = await Player.findOne({ playerId: info.playerId })

  if (playerInDb) {
    if (isDuplicate(playerInDb, gamePk)) {
      throw new Error('Duplicate internal game id!')
    }
  }

  if (!playerInDb) {
    const player = new Player({ ...info, boxscores: { ...finalStats } })
    try {
      return player.save()
    } catch ({ name, message }) {
      console.error(`${name}: ${message}`)
    }
  } else {
    playerInDb.boxscores.push(finalStats)
    try {
      return playerInDb.save()
    } catch ({ name, message }) {
      console.error(`${name}: ${message}`)
    }
  }
}

const fetchBoxscore = async gamePk => {
  const { data } = await axios.get(boxscoreUrl(gamePk))
  const {
    teams: { away },
  } = data
  const {
    teams: { home },
  } = data
  const players = { ...away.players, ...home.players }

  for (const key in players) {
    try {
      await handlePlayer(players[key], gamePk)
    } catch ({ name, message }) {
      console.error(`${name}: ${message}`)
    }
  }
}

const fetchGames = async date => {
  const {
    data: { dates },
  } = await axios.get(gamesUrl(date))
  const { games } = dates[0]

  for (const game of games) {
    const { gamePk } = game
    console.log('fetching gamepk', gamePk)
    await fetchBoxscore(gamePk)
  }
}

const dates = ['2019-01-09', '2019-01-10', '2019-01-11', '2019-01-12']
const promises = []

for (const date of dates) {
  const promise = fetchGames(date)
  promises.push(promise)
}

Promise.all(promises).then(() => mongoose.connection.close())
