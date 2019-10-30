const { CronJob } = require('cron')
const amqp = require('amqp-connection-manager')
const Job = require('../models/job')

const clock = async () => {
  const tweetJobs = await Job.find({})

  const AMQP_URL = process.env.CLOUDAMQP_URL || 'amqp://localhost'
  if (!AMQP_URL) process.exit(1)

  const WORKER_QUEUE = 'worker-queue'

  const staticJobs = [
    {
      name: 'Set script states to false',
      message: { taskName: 'resetScriptStates', queue: 'worker-queue' },
      cronTime: '0 21 * * *',
      repeat: 1,
    },
    {
      name: 'Fetch team stats of the day',
      message: { taskName: 'fetchTeamStats', queue: 'worker-queue' },
      cronTime: '28 5 * * *',
      repeat: 1,
    },
    {
      name: 'Fetch games of the day',
      message: { taskName: 'fetchGames', queue: 'worker-queue' },
      cronTime: '30 5 * * *',
      repeat: 1,
    },
    {
      name: 'Fetch boxscores of the day',
      message: { taskName: 'fetchBoxscores', queue: 'worker-queue' },
      cronTime: '40 5 * * *',
      repeat: 1,
    },
    {
      name: 'Fetch goals of the day',
      message: { taskName: 'fetchGoals', queue: 'worker-queue' },
      cronTime: '50 5 * * *',
      repeat: 1,
    },
  ]

  const JOBS = [...staticJobs, ...tweetJobs]

  // Create a new connection manager from AMQP
  var connection = amqp.connect([AMQP_URL])
  console.log('[AMQP] - Connecting...')

  connection.on('connect', function() {
    process.once('SIGINT', function() {
      // Close conn on exit
      connection.close()
    })
    console.log('[AMQP] - Connected!')
    return startCronProcess(JOBS)
  })

  connection.on('disconnect', function(params) {
    return console.error('[AMQP] - Disconnected.', params.err.stack)
  })

  const startCronProcess = jobs => {
    if (jobs && jobs.length) {
      jobs.forEach(job => {
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
      })
    }
  }

  const sendMessage = message => {
    if (!message) {
      return
    }

    let queue = message.queue || WORKER_QUEUE
    let senderChannelWrapper = connection.createChannel({
      json: true,
      setup: function(channel) {
        return channel.assertQueue(queue, { durable: true })
      },
    })

    senderChannelWrapper
      .sendToQueue(queue, message, {
        contentType: 'application/json',
        persistent: true,
      })
      .then(function() {
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
}

module.exports = clock
