const mongoose = require('mongoose')

const lastUpdateSchema = mongoose.Schema({
  boxscoreUpdate: {
    type: Date,
    required: true,
  },
  teamStatsUpdate: {
    type: Date,
    required: true,
  },
})

const lastUpdate = mongoose.model('lastUpdate', lastUpdateSchema)

module.exports = lastUpdate
