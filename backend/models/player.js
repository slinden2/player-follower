const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const playerSchema = mongoose.Schema({
  playerId: {
    type: Number,
    required: true,
    unique: true,
  },
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
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
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
  boxscores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'boxscoreType',
    },
  ],
  stats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'statType',
    },
  ],
  boxscoreType: {
    type: String,
    required: true,
    enum: ['SkaterBoxscore', 'GoalieBoxscore'],
  },
  statType: {
    type: String,
    required: true,
    enum: ['SkaterStats', 'GoalieStats'],
  },
  active: {
    type: Boolean,
    required: true,
  },
})

playerSchema.plugin(uniqueValidator)

playerSchema.index({ firstName: 'text', lastName: 'text' })

playerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.boxscoreType
    delete returnedObject.statType
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Player', playerSchema)
