/*
Resets the test db completely by dropping it.
*/

const mongoose = require('mongoose')

const resetDb = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('This script runs only in testing context.')
  }

  console.log('reset-db.dropping-database')
  await mongoose.connection.db.dropDatabase()
  console.log('reset-db.database-dropped')
}

module.exports = resetDb
