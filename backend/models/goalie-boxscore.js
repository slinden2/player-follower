const mongoose = require('mongoose')

const goalieBoxscoreSchema = mongoose.Schema({
  gamePk: {
    type: Number,
    required: true,
  },
  gameDate: {
    type: Date,
    required: true,
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  timeOnIce: {
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
  penaltyMinutes: {
    type: Number,
    required: true,
  },
  saves: {
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
  evenSaves: {
    type: Number,
    required: true,
  },
  shotsAgainst: {
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
  decision: {
    type: String,
  },
  savePct: {
    type: Number,
    required: true,
  },
  powerPlaySavePct: {
    type: Number,
  },
  shortHandedSavePct: {
    type: Number,
  },
  evenSavePct: {
    type: Number,
  },
})

goalieBoxscoreSchema.index({ gamePk: 1, player: 1 }, { unique: true })

goalieBoxscoreSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('GoalieBoxscore', goalieBoxscoreSchema)
