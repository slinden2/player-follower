const amqp = require('amqp-connection-manager')
const { exec } = require('child_process')

const AMQP_URL = process.env.CLOUDAMQP_URL || 'amqp://localhost'
if (!AMQP_URL) process.exit(1)

const WORKER_QUEUE = 'worker-queue'

// Create a new connection manager from AMQP
var connection = amqp.connect([AMQP_URL])
console.log('[AMQP] - Connecting...')

connection.on('connect', function() {
  process.once('SIGINT', function() {
    // Close conn on exit
    connection.close()
  })
  return console.log('[AMQP] - Connected!')
})

connection.on('disconnect', function(params) {
  return console.error('[AMQP] - Disconnected.', params.err.stack)
})

// ---------- To receive the execution task messages
let channelWrapper = connection.createChannel({
  json: true,
  setup: function(channel) {
    return Promise.all([
      channel.assertQueue(WORKER_QUEUE, { autoDelete: true, durable: false }),
      channel.prefetch(1),
      channel.consume(WORKER_QUEUE, onMessage),
    ])
  },
})

channelWrapper
  .waitForConnect()
  .then(function() {
    console.log('[AMQP] - Listening for messages on queue => ' + WORKER_QUEUE)
  })
  .catch(function(err) {
    console.error('[AMQP] - Error! ', err)
  })

// Process message from AMQP
function onMessage(data) {
  let message
  try {
    message = JSON.parse(data.content.toString())
  } catch (e) {
    console.error('[AMQP] - Error parsing message... ', data)
  }

  console.log('[AMQP] - Receiving message... ', message)
  channelWrapper.ack(data)
  if (!message) {
    return
  }

  switch (message.taskName) {
  case 'resetScriptStates': {
    console.log('[AMQP] - Running resetScriptStates')
    exec('npm run reset_script_states_prod', (err, stdout, stderr) => {
      console.log('stdout\n', stdout)
      if (stderr) {
        console.error('stderr\n', stderr)
      }
      console.log('[AMQP] - resetScriptStates completed')
    })
    break
  }
  case 'fetchTeamStats': {
    console.log('[AMQP] - Running fetchTeamStats')
    exec('npm run fetch_team_stats_prod', (err, stdout, stderr) => {
      console.log('stdout\n', stdout)
      if (stderr) {
        console.error('stderr\n', stderr)
      }
      console.log('[AMQP] - fetchTeamStats completed')
    })
    break
  }
  case 'fetchGames': {
    console.log('[AMQP] - Running fetchGames')
    exec('npm run fetch_games_prod', (err, stdout, stderr) => {
      console.log('stdout\n', stdout)
      if (stderr) {
        console.error('stderr\n', stderr)
      }
      console.log('[AMQP] - fetchGames completed')
    })
    break
  }
  case 'fetchBoxscores': {
    console.log('[AMQP] - Running fetchBoxscores')
    exec('npm run fetch_boxscores_prod', (err, stdout, stderr) => {
      console.log('stdout\n', stdout)
      if (stderr) {
        console.error('stderr\n', stderr)
      }
      console.log('[AMQP] - fetchBoxscores completed')
    })
    break
  }
  case 'fetchGoals': {
    console.log('[AMQP] - Running fetchGoals')
    exec('npm run fetch_goals_prod', (err, stdout, stderr) => {
      console.log('stdout\n', stdout)
      if (stderr) {
        console.error('stderr\n', stderr)
      }
      console.log('[AMQP] - fetchGoals completed')
    })
    break
  }
  case 'postTweet': {
    console.log('[AMQP] - Running postTweet')
    exec(
      `npm run post_tweet_prod ${message.dataId}`,
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
