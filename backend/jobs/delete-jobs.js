/*
Deletes tweets daily. Old tweets must be deleted before creating new ones.
*/

const mongoose = require('mongoose')
const Job = require('../models/job')
const Tweet = require('../models/tweet')
const config = require('../utils/config')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('delete-jobs.connected-to-db')
} catch (err) {
  console.error('delete-jobs.db-connection-error\n', err.stack)
  process.exit(1)
}

const deleteJobs = async () => {
  await Tweet.deleteMany({})
  await Job.deleteMany({})
}

deleteJobs()
  .catch(err => console.error('delete-jobs.deleteJobs', err.stack))
  .then(() => mongoose.connection.close())
