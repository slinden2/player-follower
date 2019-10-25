const mongoose = require('mongoose')
const config = require('../../utils/config')
const Game = require('../../models/game')
const fetchGoals = require('./fetch-goals')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('fetch-goals.index.connected-to-db')
} catch (exception) {
  console.error('fetch-goals.index.db-connection-error')
  console.error(exception)
  return
}

// console.log(`fetch-goals.index.fetch-started-${gamePk}`)

if (process.argv[2]) {
  const gamePks = [process.argv[2]]
  runFetchGoals(gamePks)
} else {
  Game.find({}, { apiDate: 1, _id: 0 })
    .sort({ apiDate: -1 })
    .skip(1)
    .limit(1)
    .then(([date]) =>
      Game.find({ apiDate: date.apiDate }, { gamePk: 1, _id: 0 }).then(
        gamePks => {
          runFetchGoals(gamePks.map(game => game.gamePk))
        }
      )
    )
}

const runFetchGoals = async gamePks => {
  try {
    await fetchGoals(gamePks)
  } catch (err) {
    console.error(`fetch-goals.fetchGoals - ${gamePks}\n`, err.stack)
  } finally {
    mongoose.connection.close()
  }
}

// fetchGoals(gamePks)
//   .catch(({ name, message }) => {
//     console.error(`fetch-goals.fetchGoals: ${name}: ${message}`)
//   })
//   .then(() => mongoose.connection.close())
