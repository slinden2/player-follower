const mongoose = require('mongoose')

const goalieStatsSchema = mongoose.Schema({
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
  gamesStarted: {
    type: Number,
    required: true,
  },
  ot: {
    type: Number,
    required: true,
  },
  shutouts: {
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
  timeOnIce: {
    type: Number,
    required: true,
  },
  timeOnIcePerGame: {
    type: Number,
    required: true,
  },
  saves: {
    type: Number,
    required: true,
  },
  evenSaves: {
    type: Number,
    required: true,
  },
  powerPlaySaves: {
    type: Number,
    required: true,
  },
  shortHandedSaves: {
    type: Number,
    required: true,
  },
  shotsAgainst: {
    type: Number,
    required: true,
  },
  evenShotsAgainst: {
    type: Number,
    required: true,
  },
  powerPlayShotsAgainst: {
    type: Number,
    required: true,
  },
  shortHandedShotsAgainst: {
    type: Number,
    required: true,
  },
  goalsAgainst: {
    type: Number,
    required: true,
  },
  goalsAgainstAverage: {
    type: Number,
    required: true,
  },
  savePct: {
    type: Number,
    required: true,
  },
  evenSavePct: {
    type: Number,
  },
  powerPlaySavePct: {
    type: Number,
  },
  shortHandedSavePct: {
    type: Number,
  },
})

goalieStatsSchema.index({ date: 1, player: 1 }, { unique: true })

goalieStatsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('GoalieStats', goalieStatsSchema)
