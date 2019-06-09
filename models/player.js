const mongoose = require('mongoose')

var ObjectId = mongoose.Schema.Types.ObjectId

const statsSchema = mongoose.Schema({
  date: Number,
  season: String,
  timeOnIce: String,
  assists: Number,
  goals: Number,
  pim: Number,
  shots: Number,
  games: Number,
  hits: Number,
  powerPlayGoals: Number,
  powerPlayPoints: Number,
  powerPlayTimeOnIce: String,
  evenTimeOnIce: String,
  penaltyMinutes: String,
  faceOffPct: Number,
  shotPct: Number,
  gameWinningGoals: Number,
  overTimeGoals: Number,
  shortHandedGoals: Number,
  shortHandedPoints: Number,
  shortHandedTimeOnIce: String,
  blocked: Number,
  plusMinus: Number,
  points: Number,
  shifts: Number,
  timeOnIcePerGame: String,
  evenTimeOnIcePerGame: String,
  shortHandedTimeOnIcePerGame: String,
  powerPlayTimeOnIcePerGame: String,
})

const playerSchema = mongoose.Schema({
  id: Number, // Check this later
  fullName: String,
  link: String,
  firstName: String,
  lastName: String,
  primaryNumber: Number,
  birthDate: Date,
  currentAge: String,
  birthCity: String,
  birthCountry: String,
  nationality: String,
  height: String,
  weight: Number,
  active: Boolean,
  alternateCaptain: Boolean,
  captain: Boolean,
  rookie: Boolean,
  shootsCatches: String,
  rosterStatus: String,
  currentTeam: Number, // Check this later
  primaryPosition: String,
  stats: [statsSchema],
})

module.exports = mongoose.model('Player', playerSchema)
