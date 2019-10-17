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
  player: {
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
  type: {
    type: String,
    required: true,
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
