const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const statsSchema = mongoose.Schema({
  gamePk: Number,
  date: Number,
  timeOnIce: Number,
  assists: Number,
  goals: Number,
  shots: Number,
  hits: Number,
  powerPlayGoals: Number,
  powerPlayAssists: Number,
  penaltyMinutes: Number,
  faceOffWins: Number,
  faceoffTaken: Number,
  takeaways: Number,
  giveaways: Number,
  shortHandedGoals: Number,
  shortHandedAssists: Number,
  blocked: Number,
  plusMinus: Number,
  evenTimeOnIce: Number,
  powerPlayTimeOnIce: Number,
  shortHandedTimeOnIce: Number,
  // Only goalie stats from this point
  saves: Number,
  powerPlaySaves: Number,
  shortHandedSaves: Number,
  evenSaves: Number,
  shortHandedShotsAgainst: Number,
  evenShotsAgainst: Number,
  powerPlayShotsAgainst: Number,
  decision: String,
})

const playerSchema = mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  primaryNumber: {
    type: Number,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  birthCity: {
    type: String,
    required: true,
  },
  birthStateProvince: String,
  birthCountry: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  alternateCaptain: {
    type: Boolean,
    required: true,
  },
  captain: {
    type: Boolean,
    required: true,
  },
  rookie: {
    type: Boolean,
    required: true,
  },
  shootsCatches: {
    type: String,
    required: true,
  },
  rosterStatus: {
    type: String,
    required: true,
  },
  currentTeam: {
    type: Number,
    required: true,
  },
  primaryPosition: {
    type: String,
    required: true,
  },
  playerId: {
    type: Number,
    unique: true,
    required: true,
  },
  stats: [statsSchema],
})

playerSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Player', playerSchema)
