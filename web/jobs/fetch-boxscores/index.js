const mongoose = require('mongoose')
const config = require('../../utils/config')
const fetchGames = require('./fetch-games')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// validate date string
if (process.argv[2]) {
  const dateArg = process.argv[2]
  if (!/^20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/.test(dateArg)) {
    throw new Error('Invalid date argument')
  }
}

try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('fetch-game-data.index.connected-to-db')
} catch (exception) {
  console.error('fetch-game-data.index.db-connection-error')
  console.error(exception)
  return
}

const timeYesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)

// construct current date in YYYY-MM-DD format
const UTC_DATE = timeYesterday.toISOString().split('T')[0]
const date = process.argv[2] || UTC_DATE

console.log(`fetch-game-data.index.fetch-started-${date}`)

fetchGames(date)
  .catch(({ name, message }) => {
    console.error(`fetch-game-data.fetchGames: ${name}: ${message}`)
  })
  .then(() => mongoose.connection.close())
