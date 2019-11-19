const mongoose = require('mongoose')
const axios = require('axios')
const config = require('../../utils/config')
const ScriptState = require('../../models/script-state')
const handleGames = require('./handle-games')
const { isValidDate } = require('../fetch-helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// validate date string
if (process.argv[2]) {
  isValidDate(process.argv[2])
}

try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('fetch-games.index.connected-to-db')
} catch (err) {
  console.error('fetch-games.index.db-connection-error\n', err.stack)
  return
}

const gamesUrl = date =>
  `https://statsapi.web.nhl.com/api/v1/schedule?date=${date}`

const fetchGames = async date => {
  const scriptAlreadyRan = await ScriptState.findOne({})
  if (scriptAlreadyRan.fetchGames) {
    throw new Error(
      `fetch-games.fetchGames - Games have been already fetched for ${date}`
    )
  }

  const url = gamesUrl(date)
  console.log(`fetch-games.fetchGames - url: ${url}`)

  try {
    const {
      data: { dates },
    } = await axios.get(url)

    if (!dates.length) {
      throw new Error(`No games available: ${url}`)
    }

    const { games } = dates[0]

    await handleGames(date, games)
    await ScriptState.updateOne({}, { fetchGames: true })
  } catch (err) {
    console.error(`fetch-games.fetchGames - date: ${date}\n${err.stack}`)
  }
}

const timeYesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)

// construct current date in YYYY-MM-DD format
const UTC_DATE = timeYesterday.toISOString().split('T')[0]
const date = process.argv[2] || UTC_DATE

console.log(`fetch-games.index.fetch-started-${date}`)

fetchGames(date)
  .then(() => {
    mongoose.connection.close()
    process.exit(0)
  })
  .catch(err => {
    console.error(
      `fetch-games.fetchGames: ${err.name}: ${err.message}\n${err.stack}`
    )
    mongoose.connection.close()
    process.exit(1)
  })
