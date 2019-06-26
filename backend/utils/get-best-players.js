const reduceStats = require('./reduce-stats')

// const NUM_OF_GAMES = [3, 5, 10]

const sortByGamePk = (a, b) => b.gamePk - a.gamePk

const sortByPerformance = (a, b) =>
  b.stats.points - a.stats.points ||
  b.stats.goals - a.stats.goals ||
  b.stats.plusMinus - a.stats.plusMinus

const getBestPlayers = players => {
  const playersSorted = players.map(player => {
    player.boxscores = player.boxscores.sort((a, b) => sortByGamePk(a, b))
    return player
  })

  const newPlayers = []
  for (const player of playersSorted) {
    player.stats = reduceStats(player, 3)
    newPlayers.push(player)
  }
  const sortedPlayers = newPlayers
    .sort((a, b) => sortByPerformance(a, b))
    .slice(0, 3)

  return [sortedPlayers]
}

module.exports = getBestPlayers
