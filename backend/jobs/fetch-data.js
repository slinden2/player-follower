if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const axios = require('axios')
const mongoose = require('mongoose')
const Player = require('../models/player')
const config = require('../utils/config')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const GAMES_URL = 'https://statsapi.web.nhl.com/api/v1/schedule?date=2019-01-09'
const boxscoreUrl = gamePk =>
  `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/boxscore`
// const GAMES_URL = 'http://localhost:3001/games/2'
// const boxscoreUrl = (gamePk) => `http://localhost:3001/gamePks/${gamePk}`

const isDuplicate = (player, gamePk) => {
  const result = player.stats.filter(obj => obj.gamePk === gamePk)
  return result.length > 0
}

const handlePlayer = async (playerData, gamePk) => {
  /* eslint-disable */
  const {
    currentTeam,
    primaryPosition,
    currentAge,
    ...info
  } = playerData.person
  /* eslint-enable */
  info.currentTeam = playerData.person.currentTeam.id
  info.primaryPosition = playerData.person.primaryPosition.code

  const {
    stats: { skaterStats },
  } = playerData
  const {
    stats: { goalieStats },
  } = playerData

  if (!skaterStats && !goalieStats) return

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

  const playerInDb = await Player.findOne({ id: info.id })

  if (playerInDb) {
    if (isDuplicate(playerInDb, gamePk)) {
      throw new Error('Duplicate internal game id!')
    }
  }

  if (!playerInDb) {
    const player = new Player({ ...info, stats: { ...finalStats } })
    try {
      return player.save()
    } catch ({ name, message }) {
      console.error(`${name}: ${message}`)
    }
  } else {
    playerInDb.stats.push(finalStats)
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

const fetchGames = async () => {
  const {
    data: { dates },
  } = await axios.get(GAMES_URL)
  const { games } = dates[0]
  for (const game of games) {
    const { gamePk } = game
    console.log('fetching gamepk', gamePk)
    await fetchBoxscore(gamePk)
  }
}

fetchGames().then(() => mongoose.connection.close())
