const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const divisionSchema = mongoose.Schema({
  divisionId: {
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
  conference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conference',
  },
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

divisionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

divisionSchema.plugin(uniqueValidator)

const Division = mongoose.model('Division', divisionSchema)

module.exports = Division
