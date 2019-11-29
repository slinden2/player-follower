const mongoose = require('mongoose')
const config = require('../../utils/config')
const Game = require('../../models/game')
const fetchLinescores = require('./fetch-linescores')
const { isValidDate } = require('../fetch-helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('fetch-linescores.index.connected-to-db')
} catch (err) {
  console.error('fetch-linescores.index.db-connection-error', err.stack)
  return
}

if (process.argv[2]) {
  const date = process.argv[2]
  isValidDate(date)
  Game.find(
    { apiDate: new Date(date).toISOString() },
    { gamePk: 1, apiDate: 1, awayTeam: 1, homeTeam: 1 }
  ).then(gameData => {
    runFetchLinescores(gameData)
  })
} else {
  Game.find({}, { apiDate: 1, _id: 0 })
    .sort({ apiDate: -1 })
    .limit(1)
    .then(([date]) =>
      Game.find(
        { apiDate: date.apiDate },
        { gamePk: 1, apiDate: 1, awayTeam: 1, homeTeam: 1 }
      ).then(gameData => {
        runFetchLinescores(gameData)
      })
    )
}

const runFetchLinescores = async gameData => {
  const gamePks = gameData.map(game => game.gamePk)
  try {
    await fetchLinescores(gameData, gamePks)
    mongoose.connection.close()
    process.exit(0)
  } catch (err) {
    console.error(`fetch-linescores.fetchLinescores - ${gamePks}\n`, err.stack)
    mongoose.connection.close()
    process.exit(1)
  }
}
