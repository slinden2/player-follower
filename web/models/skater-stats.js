const mongoose = require('mongoose')

const skaterStatsSchema = mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  date: {
    type: String,
    required: true,
  },
  seasonId: {
    type: String,
    required: true,
  },
  gamesPlayed: {
    type: Number,
    required: true,
  },
  assists: {
    type: Number,
    required: true,
  },
  goals: {
    type: Number,
    required: true,
  },
  plusMinus: {
    type: Number,
    required: true,
  },
  penaltyMinutes: {
    type: Number,
    required: true,
  },
  powerPlayAssists: {
    type: Number,
    required: true,
  },
  powerPlayGoals: {
    type: Number,
    required: true,
  },
  shortHandedAssists: {
    type: Number,
    required: true,
  },
  shortHandedGoals: {
    type: Number,
    required: true,
  },
  gameWinningGoals: {
    type: Number,
    required: true,
  },
  overTimeGoals: {
    type: Number,
    required: true,
  },
  shots: {
    type: Number,
    required: true,
  },
  hits: {
    type: Number,
    required: true,
  },
  blocked: {
    type: Number,
    required: true,
  },
  shifts: {
    type: Number,
    required: true,
  },
  faceOffPct: {
    type: Number,
    required: true,
  },
  timeOnIce: {
    type: Number,
    required: true,
  },
  evenTimeOnIce: {
    type: Number,
    required: true,
  },
  powerPlayTimeOnIce: {
    type: Number,
    required: true,
  },
  shortHandedTimeOnIce: {
    type: Number,
    required: true,
  },
})

skaterStatsSchema.index({ date: 1, player: 1 }, { unique: true })

skaterStatsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('SkaterStats', skaterStatsSchema)
