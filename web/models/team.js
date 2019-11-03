const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const teamSchema = mongoose.Schema({
  teamId: {
    type: Number,
    required: true,
    unique: true,
  },
  link: {
    type: String,
    required: true,
    unique: true,
  },
  siteLink: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  teamName: {
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
  locationName: {
    type: String,
    required: true,
  },
  firstYearOfPlay: {
    type: String,
    required: true,
  },
  officialSiteUrl: {
    type: String,
    required: true,
    unique: true,
  },
  conference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conference',
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division',
  },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
  ],
  stats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamStats',
    },
  ],
  linescores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Linescore',
    },
  ],
  active: {
    type: Boolean,
    required: true,
  },
  twitterHashtag: String,
})

teamSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

teamSchema.plugin(uniqueValidator)

const Team = mongoose.model('Team', teamSchema)

module.exports = Team
