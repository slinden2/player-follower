const Player = require('../models/player')

const resolvers = {
  Query: {
    playerCount: () => Player.collection.countDocuments(),
    allPlayers: async () => {
      const players = await Player.find({})
      return players
    },
  },
}

module.exports = resolvers
