const reduceStats = require('./reduce-stats')

const NUM_OF_GAMES = [3, 5, 10]

const sortByGamePk = (a, b) => b.boxscores.gamePk - a.boxscores.gamePk

const sortByPerformance = (a, b) =>
  b.stats.points - a.stats.points ||
  b.stats.goals - a.stats.goals ||
  b.stats.plusMinus - a.stats.plusMinus

const getBestPlayers = players => {
  const playersSorted = players.sort((a, b) => sortByGamePk(a, b))

  const result = []
  for (const num of NUM_OF_GAMES) {
    const newPlayers = []
    for (const player of playersSorted) {
      player.stats = reduceStats(player, num)
      newPlayers.push(player)
    }
    const sortedPlayers = newPlayers
      .sort((a, b) => sortByPerformance(a, b))
      .slice(0, 10)
    result.push(sortedPlayers)
  }
  return result
}

module.exports = getBestPlayers
