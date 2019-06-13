const Player = require('../models/player')

const resolvers = {
  Query: {
    allPlayers: async () => {
      const players = await Player.find({})
      return players
    },
  },
}

module.exports = resolvers
