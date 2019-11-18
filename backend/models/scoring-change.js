const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const scoringChangeSchema = mongoose.Schema({
  tweetId: {
    type: Number,
    required: true,
    unique: true,
  },
  gamePk: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  screenName: {
    type: String,
    required: true,
  },
})

scoringChangeSchema.plugin(uniqueValidator)

const ScoringChange = mongoose.model('ScoringChange', scoringChangeSchema)

module.exports = ScoringChange
