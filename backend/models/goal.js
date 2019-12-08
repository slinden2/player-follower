const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const coordinateSchema = mongoose.Schema(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

const goalSchema = mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
  },
  scorer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  assist1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  assist2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  goalie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  milestone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  gamePk: {
    type: Number,
    required: true,
  },
  apiDate: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  shotType: {
    type: String,
  },
  strength: {
    type: String,
    required: true,
  },
  gameWinningGoal: {
    type: Boolean,
    required: true,
    default: false,
  },
  emptyNet: {
    type: Boolean,
    required: true,
    default: false,
  },
  eventIdx: {
    type: Number,
    required: true,
  },
  eventId: {
    type: Number,
    required: true,
  },
  periodType: {
    type: String,
    required: true,
  },
  periodNumber: {
    type: Number,
    required: true,
  },
  periodTime: {
    type: Number,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  coordinates: coordinateSchema,
})

goalSchema.index({ gamePk: 1, eventIdx: 1 }, { unique: true })

goalSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

goalSchema.plugin(uniqueValidator)

const Goal = mongoose.model('Goal', goalSchema)

module.exports = Goal
