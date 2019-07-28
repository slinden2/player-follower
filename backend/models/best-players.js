const mongoose = require('mongoose')

const bestPlayersSchema = mongoose.Schema({
  oneGame: {
    type: String,
    required: true,
  },
  fiveGames: {
    type: String,
    required: true,
  },
  tenGames: {
    type: String,
    required: true,
  },
})

bestPlayersSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const BestPlayers = mongoose.model('BestPlayers', bestPlayersSchema)

module.exports = BestPlayers
