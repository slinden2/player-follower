const { CronJob } = require('cron')
const amqp = require('amqp-connection-manager')

const AMQP_URL = process.env.CLOUDAMQP_URL || 'amqp://localhost'
if (!AMQP_URL) process.exit(1)

const REC_QUEUE = 'command'
const SEND_QUEUE = 'worker'

// Create a new connection manager from AMQP
const connection = amqp.connect([AMQP_URL])
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

const rxChannelWrapper = connection.createChannel({
  json: true,
  setup: channel =>
    Promise.all([
      channel.assertQueue(REC_QUEUE, { durable: true, expires: 864000000 }),
      channel.prefetch(1),
      channel.consume(REC_QUEUE, onMessage),
    ]),
})

rxChannelWrapper
  .waitForConnect()
  .then(() => {
    console.log(`[AMQP] - Listening for messages on queue => ${REC_QUEUE}`)
  })
  .catch(err => {
    console.error(`[AMQP] - Error! ${err}`)
  })

const onMessage = data => {
  let jobs
  try {
    jobs = JSON.parse(data.content.toString())
  } catch (err) {
    console.error(`[AMQP] - Error parsing message... ${data}`)
  }

  console.log(`[AMQP] - Receiving message... ${JSON.stringify(jobs, null, 2)}`)
  rxChannelWrapper.ack(data)

  if (jobs && jobs.length) {
    jobs.forEach(job => {
      startCronProcess(job)
    })
  }
}

const startCronProcess = job => {
  let j = new CronJob({
    cronTime: job.cronTime,
    onTick: () => {
      sendMessage(job.message)
      if (!job.repeat) j.stop()
    },
    onComplete: () => {
      console.log('Job completed! Removing now...')
    },
    start: true, // Start now
  })
}

const sendMessage = message => {
  if (!message) {
    return
  }

  const queue = message.queue || SEND_QUEUE
  const senderChannelWrapper = connection.createChannel({
    json: true,
    setup: channel => {
      return channel.assertQueue(queue, { durable: true, expires: 864000000 })
    },
  })

  senderChannelWrapper
    .sendToQueue(queue, message, {
      contentType: 'application/json',
    })
    .then(() => {
      console.log('[AMQP] - Message sent to queue =>', queue)
      senderChannelWrapper.close()
    })
    .catch(err => {
      console.error(
        '[AMQP] - Message to queue => ' + queue + '<= was rejected! ',
        err.stack
      )
      senderChannelWrapper.close()
    })
}
