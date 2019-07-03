const mongoose = require('mongoose')

const tokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: { expires: 3600 }, // seconds
  },
})

const User = mongoose.model('Token', tokenSchema)

module.exports = User
