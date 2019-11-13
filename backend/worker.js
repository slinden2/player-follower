const amqp = require('amqp-connection-manager')
const { exec } = require('child_process')

let processExt = ''

if (process.env.NODE_ENV === 'production') {
  processExt = '_prod'
}

const AMQP_URL = process.env.CLOUDAMQP_URL || 'amqp://localhost'
if (!AMQP_URL) process.exit(1)

const REC_QUEUE = 'worker'

// Create a new connection manager from AMQP
const connection = amqp.connect([AMQP_URL])
console.log('[AMQP] - Connecting...')

connection.on('connect', () => {
  process.once('SIGINT', () => {
    // Close conn on exit
    connection.close()
  })
  return console.log('[AMQP] - Connected!')
})

connection.on('disconnect', params => {
  return console.error('[AMQP] - Disconnected.', params.err.stack)
})

// ---------- To receive the execution task messages
const channelWrapper = connection.createChannel({
  json: true,
  setup: channel => {
    return Promise.all([
      channel.assertQueue(REC_QUEUE, { durable: true, expires: 864000000 }),
      channel.prefetch(1),
      channel.consume(REC_QUEUE, onMessage),
    ])
  },
})

channelWrapper
  .waitForConnect()
  .then(() => {
    console.log(`[AMQP] - Listening for messages on queue => ${REC_QUEUE}`)
  })
  .catch(err => {
    console.error('[AMQP] - Error! ', err)
  })

// Process message from AMQP
const onMessage = data => {
  let message
  try {
    message = JSON.parse(data.content.toString())
  } catch (err) {
    console.error(`[AMQP] - Error parsing message... ${data}`)
  }

  console.log(
    `[AMQP] - Receiving message... ${JSON.stringify(message, null, 2)}`
  )
  channelWrapper.ack(data)
  if (!message) {
    return
  }

  switch (message.taskName) {
    case 'postTweet': {
      console.log('[AMQP] - Running postTweet')
      exec(
        `npm run post_tweet${processExt} ${message.dataId}`,
        (err, stdout, stderr) => {
          console.log('stdout\n', stdout)
          if (stderr) {
            console.error('stderr\n', stderr)
          }
          console.log('[AMQP] - postTweet completed')
        }
      )
      break
    }

    default:
      console.error('No task was found with name => ' + message.taskName)
  }
}
