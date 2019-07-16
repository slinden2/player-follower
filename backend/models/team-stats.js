const mongoose = require('mongoose')

const teamStatsSchema = mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  seasonId: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  gamesPlayed: {
    type: Number,
    required: true,
  },
  wins: {
    type: Number,
    required: true,
  },
  losses: {
    type: Number,
    required: true,
  },
  otLosses: {
    type: Number,
    required: true,
  },
  ties: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  regPlusOtWins: {
    type: Number,
    required: true,
  },
  pointPct: {
    type: Number,
    required: true,
  },
  goalsFor: {
    type: Number,
    required: true,
  },
  goalsAgainst: {
    type: Number,
    required: true,
  },
  shootoutGamesWon: {
    type: Number,
    required: true,
  },
  goalsForPerGame: {
    type: Number,
    required: true,
  },
  goalsAgainstPerGame: {
    type: Number,
    required: true,
  },
  ppPct: {
    type: Number,
    required: true,
  },
  pkPct: {
    type: Number,
    required: true,
  },
  shotsForPerGame: {
    type: Number,
    required: true,
  },
  shotsAgainstPerGame: {
    type: Number,
    required: true,
  },
  faceOffWinPct: {
    type: Number,
    required: true,
  },
})

teamStatsSchema.index({ date: 1, team: 1 }, { unique: true })

teamStatsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const TeamStats = mongoose.model('TeamStats', teamStatsSchema)

module.exports = TeamStats
