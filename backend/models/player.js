const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const statsSchema = mongoose.Schema({
  gamePk: Number,
  date: Number,
  timeOnIce: String,
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
  evenTimeOnIce: String,
  powerPlayTimeOnIce: String,
  shortHandedTimeOnIce: String,
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
  id: {
    type: Number,
    unique: true
  },
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

playerSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Player', playerSchema)
