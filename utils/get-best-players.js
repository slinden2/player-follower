const reduceStats = require('./reduce-stats')

const getBestPlayers = players => {
  const newPlayers = []
  for (const player of players) {
    player.stats = reduceStats(player, 10)
    newPlayers.push(player)
  }
  console.log(newPlayers)
}

module.exports = getBestPlayers
