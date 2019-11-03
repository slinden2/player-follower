const mongoose = require('mongoose')

const linescoreSchema = mongoose.Schema({
  team: {
    type: mongoose.Types.ObjectId,
    ref: 'Team',
  },
  opponentId: {
    type: mongoose.Types.ObjectId,
    ref: 'Team',
  },
  game: {
    type: mongoose.Types.ObjectId,
    ref: 'Game',
  },
  gamePk: {
    type: Number,
    required: true,
  },
  isHomeGame: {
    type: Boolean,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  win: {
    type: Boolean,
    required: true,
    default: false,
  },
  otWin: {
    type: Boolean,
    required: true,
    default: false,
  },
  shootOutWin: {
    type: Boolean,
    required: true,
    default: false,
  },
  loss: {
    type: Boolean,
    required: true,
    default: false,
  },
  ot: {
    type: Boolean,
    required: true,
    default: false,
  },
  goalsFor: {
    type: Number,
    required: true,
  },
  goalsAgainst: {
    type: Number,
    required: true,
  },
  penaltyMinutes: {
    type: Number,
    required: true,
  },
  shotsFor: {
    type: Number,
    required: true,
  },
  shotsAgainst: {
    type: Number,
    required: true,
  },
  powerPlayGoals: {
    type: Number,
    required: true,
  },
  powerPlayOpportunities: {
    type: Number,
    required: true,
  },
  powerPlayOpportunitiesAllowed: {
    type: Number,
    required: true,
  },
  powerPlayGoalsAllowed: {
    type: Number,
    required: true,
  },
  faceOffsTaken: {
    type: Number,
    required: true,
  },
  faceOffWins: {
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
  hitsFor: {
    type: Number,
    required: true,
  },
  hitsAgainst: {
    type: Number,
    required: true,
  },
})

linescoreSchema.index({ gamePk: 1, team: 1 }, { unique: true })

linescoreSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Linescore = mongoose.model('Linescore', linescoreSchema)

module.exports = Linescore
