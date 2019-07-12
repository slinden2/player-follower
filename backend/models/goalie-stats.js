const mongoose = require('mongoose')

const goalieStatsSchema = mongoose.Schema({
  gamePk: {
    type: Number,
    required: true,
  },
  gameDate: {
    type: Number,
    required: true,
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  saves: {
    type: Number,
    required: true,
  },
  shotsAgainst: {
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
  takeaways: {
    type: Number,
    required: true,
  },
  giveaways: {
    type: Number,
    required: true,
  },
  faceOffWins: {
    type: Number,
    required: true,
  },
  faceOffsTaken: {
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

goalieStatsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('GoalieStats', goalieStatsSchema)
