const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const videoSchema = require('./video-schema')

const teamSchema = mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    score: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

const gameSchema = mongoose.Schema({
  gamePk: {
    type: Number,
    required: true,
    unique: true,
  },
  liveLink: {
    type: String,
    required: true,
    unique: true,
  },
  contentLink: {
    type: String,
    required: true,
    unique: true,
  },
  gameDate: {
    type: Date,
    required: true,
  },
  apiDate: {
    type: Date,
    required: true,
  },
  gameType: {
    type: String,
    required: true,
  },
  awayTeam: teamSchema,
  homeTeam: teamSchema,
  gameRecap: videoSchema,
  gameCondensed: videoSchema,
  milestones: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone',
    },
  ],
})

gameSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

gameSchema.plugin(uniqueValidator)

const Game = mongoose.model('Game', gameSchema)

module.exports = Game
