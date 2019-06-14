const Player = require('../models/player')
const roundToOneDecimal = require('../utils/roundToOneDecimal')

const resolvers = {
  Query: {
    playerCount: () => Player.collection.countDocuments(),
    allPlayers: async () => {
      const players = await Player.find({})
      return players
    },
    findPlayer: async (root, args) => {
      const player = await Player.findOne({
        playerId: args.playerId,
      })
      return player
    },
    findPlayers: async (root, args) => {
      const players = await Player.find({
        ...args,
      })
      return players
    },
  },
  Player: {
    fullName: root => `${root.firstName} ${root.lastName}`,
  },
  Stat: {
    faceOffPct: root => {
      if (root.faceoffTaken === 0) return 0
      return roundToOneDecimal(root.faceOffWins / root.faceoffTaken)
    },
    shotPct: root => {
      if (root.shots === 0) return 0
      return roundToOneDecimal(root.goals / root.shots)
    },
    savePct: root => {
      if (root.saves === 0) return 0
      return roundToOneDecimal(root.goals / root.saves)
    },
  },
}

module.exports = resolvers
