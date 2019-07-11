const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const playerSchema = mongoose.Schema({
  playerId: {
    type: String,
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
  boxscoreSkater: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BoxscoreSkater',
    },
  ],
})

playerSchema.plugin(uniqueValidator)

playerSchema.index({ firstName: 'text', lastName: 'text' })

playerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Player', playerSchema)
