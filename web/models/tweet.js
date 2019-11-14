const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const tweetSchema = mongoose.Schema({
  dataId: {
    type: Number,
    required: true,
    unique: true,
  },
  gameDate: {
    type: Date,
    required: true,
  },
  awayTeam: {
    type: mongoose.Types.ObjectId,
    ref: 'Team',
  },
  homeTeam: {
    type: mongoose.Types.ObjectId,
    ref: 'Team',
  },
  isSent: {
    type: Boolean,
    default: false,
  },
})

tweetSchema.plugin(uniqueValidator)

const Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = Tweet
