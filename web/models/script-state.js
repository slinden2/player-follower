const mongoose = require('mongoose')

const scriptStateSchema = mongoose.Schema({
  fetchGames: {
    type: Boolean,
    required: true,
  },
  fetchGoals: {
    type: Boolean,
    required: true,
  },
  fetchBoxscores: {
    type: Boolean,
    required: true,
  },
  fetchTeamStats: {
    type: Boolean,
    required: true,
  },
})

const ScriptState = mongoose.model('ScriptState', scriptStateSchema)

module.exports = ScriptState
