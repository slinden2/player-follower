const mongoose = require('mongoose')
const Game = require('../../models/game')
const config = require('../../utils/config')
const fetchBoxscores = require('./fetch-boxscores')
const { isValidDate } = require('../fetch-helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('fetch-boxscores.index.connected-to-db')
} catch (exception) {
  console.error('fetch-boxscores.index.db-connection-error')
  console.error(exception)
  return
}

if (process.argv[2]) {
  const date = process.argv[2]
  isValidDate(date)
  Game.find(
    { apiDate: new Date(date).toISOString() },
    { gamePk: 1, _id: 0 }
  ).then(gamePks => {
    runFetchBoxscores(gamePks.map(game => game.gamePk))
  })
} else {
  Game.find({}, { apiDate: 1, _id: 0 })
    .sort({ apiDate: -1 })
    .skip(1)
    .limit(1)
    .then(([date]) =>
      Game.find({ apiDate: date.apiDate }, { gamePk: 1, _id: 0 }).then(
        gamePks => {
          runFetchBoxscores(gamePks.map(game => game.gamePk))
        }
      )
    )
}

const runFetchBoxscores = async gamePks => {
  try {
    await fetchBoxscores(gamePks)
    mongoose.connection.close()
    process.exit(0)
  } catch (err) {
    console.error(`fetch-boxscores.fetchBoxscores - ${gamePks}\n`, err.stack)
    process.exit(1)
  }
}
