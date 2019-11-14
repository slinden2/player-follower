const mongoose = require('mongoose')
const config = require('../../utils/config')
const getJobs = require('./get-jobs')
const { sendMessages } = require('./send-messages')
// const sendJobs = require('./send-jobs')

try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('clock.connected-to-db')
} catch (err) {
  console.error('clock.db-connection-error\n', err.stack)
  return
}

const main = async () => {
  const jobs = await getJobs()
  if (!jobs.length) {
    console.log('clock - No jobs to send')
    return
  }
  await sendMessages(jobs)
}

main()
  .catch(err => console.error('clock.main ', err.stack))
  .then(() => mongoose.connection.close())
