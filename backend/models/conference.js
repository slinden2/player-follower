const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const conferenceSchema = mongoose.Schema({
  conferenceId: {
    type: Number,
    required: true,
    unique: true,
  },
  link: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  shortName: {
    type: String,
    required: true,
    unique: true,
  },
  abbreviation: {
    type: String,
    required: true,
    unique: true,
  },
  divisions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Division',
    },
  ],
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
  ],
  active: {
    type: Boolean,
    required: true,
  },
})

conferenceSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

conferenceSchema.plugin(uniqueValidator)

const Conference = mongoose.model('Conference', conferenceSchema)

module.exports = Conference
