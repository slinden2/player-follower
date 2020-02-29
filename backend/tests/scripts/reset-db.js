const mongoose = require('mongoose')
const config = require('../../utils/config')

if (process.env.NODE_ENV !== 'test') {
  throw new Error('This script runs only in testing context.')
}

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const resetDb = async () => {
  mongoose.connect(
    config.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log('reset-db.connected-to-db')
      console.log('reset-db.dropping-database')
      mongoose.connection.db.dropDatabase()
      console.log('reset-db.database-dropped')
      process.exit(0)
    }
  )
}

resetDb()
