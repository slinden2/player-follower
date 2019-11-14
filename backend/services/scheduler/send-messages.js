const amqp = require('amqp-connection-manager')

const AMQP_URL = process.env.CLOUDAMQP_URL || 'amqp://localhost'
if (!AMQP_URL) process.exit(1)

const TX_QUEUE = 'worker'
let connection

// Create a new connection manager from AMQP
connection = amqp.connect([AMQP_URL])
console.log('[AMQP] - Connecting...')

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

const sendMessages = async messages => {
  if (!Array.isArray(messages)) {
    messages = [messages]
  }
  try {
    for (const message of messages) {
      await txChannelWrapper.sendToQueue(TX_QUEUE, message, {
        contentType: 'application/json',
        persistent: true,
      })
      console.log(`[AMQP] - Message sent to queue => ${TX_QUEUE}`)
    }
  } catch (err) {
    console.error(
      `[AMQP] - Message to queue => ${TX_QUEUE} <= was rejected! `,
      err.stack
    )
  } finally {
    txChannelWrapper.close()
    connection.close()
  }
}

process.on('exit', code => {
  console.log(`[AMQP] - Closing connection with code ${code}`)
})

module.exports = { sendMessages }
