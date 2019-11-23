const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const videoSchema = require('./video-schema')

const voteSchema = mongoose.Schema(
  {
    upVotes: {
      type: Number,
      required: true,
    },
    downVotes: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

const commentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  text: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
})

const milestoneSchema = mongoose.Schema({
  gamePk: {
    type: Number,
    required: true,
  },
  gameDate: {
    type: Date,
    required: true,
  },
  apiDate: {
    type: Date,
    required: true,
  },
  teamId: {
    type: Number,
    required: true,
  },
  opponentId: {
    type: Number,
    required: true,
  },
  playerId: {
    type: Number,
    required: true,
  },
  eventId: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  periodTime: {
    type: Number,
    required: true,
  },
  periodNumber: {
    type: Number,
    required: true,
  },
  comments: [commentSchema],
  votes: voteSchema,
  highlight: videoSchema,
})

milestoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

milestoneSchema.plugin(uniqueValidator)

const Milestone = mongoose.model('Milestone', milestoneSchema)

module.exports = Milestone
