const mongoose = require('mongoose')
const amqp = require('amqp-connection-manager')
const config = require('../../utils/config')
const getJobs = require('./get-jobs')
const { sendMessages } = require('./send-messages')

const AMQP_URL = process.env.RABBITMQ_URL || 'amqp://localhost'
if (!AMQP_URL) process.exit(1)

const TX_QUEUE = 'worker'
let connection
try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('clock.connected-to-db')

  // Create a new connection manager from AMQP
  connection = amqp.connect([AMQP_URL])
  console.log('[AMQP] - Connecting...')
} catch (err) {
  console.error('clock.db-connection-error\n', err.stack)
  return
}

connection.on('connect', () => {
  process.once('SIGINT', () => {
    // Close conn on exit
    connection.close()
  })
  console.log('[AMQP] - Connected!')
})

connection.on('disconnect', params => {
  return console.error('[AMQP] - Disconnected.', params.err.stack)
})

const txChannelWrapper = connection.createChannel({
  json: true,
  setup: channel => {
    return channel.assertQueue(TX_QUEUE, {
      durable: true,
      expires: 864000000,
    })
  },
})

const main = async () => {
  const jobs = await getJobs()
  if (!jobs.length) {
    console.log('clock - No jobs to send')
    return
  }
  await sendMessages(txChannelWrapper, TX_QUEUE, jobs)
}

main()
  .catch(err => console.error('clock.main ', err.stack))
  .finally(() => {
    mongoose.connection.close()
    txChannelWrapper.close()
    connection.close()
    process.exit(0)
  })
