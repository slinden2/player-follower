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
      channel.assertQueue(WORKER_QUEUE, { autoDelete: false, durable: true }),
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
    exec('npm run reset_script_states', (err, stdout, stderr) => {
      console.log('='.repeat(20))
      console.log('stdout\n', stdout)
      if (stderr) {
        console.log('='.repeat(20) + '\n')
        console.error('stderr\n', stderr)
      }
      console.log('='.repeat(20))
      console.log('[AMQP] - resetScriptStates completed')
    })
    break
  }
  case 'fetchTeamStats': {
    console.log('[AMQP] - Running fetchTeamStats')
    exec('npm run fetch_team_stats', (err, stdout, stderr) => {
      console.log('='.repeat(20))
      console.log('stdout\n', stdout)
      if (stderr) {
        console.log('='.repeat(20) + '\n')
        console.error('stderr\n', stderr)
      }
      console.log('='.repeat(20))
      console.log('[AMQP] - fetchTeamStats completed')
    })
    break
  }
  case 'fetchGames': {
    console.log('[AMQP] - Running fetchGames')
    exec('npm run fetch_games', (err, stdout, stderr) => {
      console.log('='.repeat(20))
      console.log('stdout\n', stdout)
      if (stderr) {
        console.log('='.repeat(20) + '\n')
        console.error('stderr\n', stderr)
      }
      console.log('='.repeat(20))
      console.log('[AMQP] - fetchGames completed')
    })
    break
  }
  case 'fetchBoxscores': {
    console.log('[AMQP] - Running fetchBoxscores')
    exec('npm run fetch_boxscores', (err, stdout, stderr) => {
      console.log('='.repeat(20))
      console.log('stdout\n', stdout)
      if (stderr) {
        console.log('='.repeat(20) + '\n')
        console.error('stderr\n', stderr)
      }
      console.log('='.repeat(20))
      console.log('[AMQP] - fetchBoxscores completed')
    })
    break
  }
  case 'fetchGoals': {
    console.log('[AMQP] - Running fetchGoals')
    exec('npm run fetch_goals', (err, stdout, stderr) => {
      console.log('='.repeat(20))
      console.log('stdout\n', stdout)
      if (stderr) {
        console.log('='.repeat(20) + '\n')
        console.error('stderr\n', stderr)
      }
      console.log('='.repeat(20))
      console.log('[AMQP] - fetchGoals completed')
    })
    break
  }

  default:
    console.error('No task was found with name => ' + message.taskName)
  }
}
