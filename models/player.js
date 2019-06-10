const mongoose = require('mongoose')

const statsSchema = mongoose.Schema({
  date: Number,
  timeOnIce: String,
  assists: Number,
  goals: Number,
  shots: Number,
  hits: Number,
  powerPlayGoals: Number,
  powerPlayAssists: Number,
  penaltyMinutes: String,
  faceOffWins: Number,
  faceoffTaken: Number,
  takeaways: Number,
  giveaways: Number,
  shortHandedGoals: Number,
  shortHandedAssists: Number,
  blocked: Number,
  plusMinus: Number,
  evenTimeOnIce: Number,
  powerPlayTimeOnIce: String,
  shortHandedTimeOnIce: String,
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
