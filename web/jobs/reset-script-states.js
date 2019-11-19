const mongoose = require('mongoose')
const ScriptState = require('../models/script-state')
const config = require('../utils/config')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('reset-script-states.connected-to-db')
} catch (err) {
  console.error('reset-script-states.db-connection-error\n', err.stack)
  return
}

const resetScriptStates = async () => {
  console.log('reset-script-states.resetScriptStates - Reset started')
  await ScriptState.updateOne(
    {},
    {
      $set: {
        fetchGames: false,
        fetchGoals: false,
        fetchBoxscores: false,
        fetchLinescores: false,
        fetchTeamStats: false,
      },
    }
  )
  console.log('reset-script-states.resetScriptStates - Reset done')
}

resetScriptStates()
  .catch(err => {
    console.error('reset-script-states.resetScriptStates\n', err.stack)
    mongoose.connection.close()
    process.exit(1)
  })
  .then(() => {
    mongoose.connection.close()
    process.exit(0)
  })
