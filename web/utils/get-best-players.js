const reduceStats = require('./reduce-stats')

/*
For sorting boxscore. Must be corrected to date in the future.
It is not guaranteed that gamePks are in progressive order.
*/
const sortByGamePk = (a, b) => b.gamePk - a.gamePk

const sortByPerformance = (a, b) =>
  b.stats.points - a.stats.points ||
  b.stats.goals - a.stats.goals ||
  b.stats.plusMinus - a.stats.plusMinus

/*
The function consumes a raw list of players from the db and
calculates accumalative stats for a X number of games. The games
are automatically picked in descending order (most recent game first).
Returns a list of 5 players performance order.
*/
const getBestPlayers = (players, numOfGames) => {
  const playersJSON = JSON.parse(JSON.stringify(players))

  const playersSorted = playersJSON.map(player => {
    player.boxscores = player.boxscores.sort((a, b) => sortByGamePk(a, b))
    return player
  })

  const newPlayers = []
  for (const player of playersSorted) {
    player.stats = reduceStats(player, numOfGames)
    newPlayers.push(player)
  }
  const sortedPlayers = newPlayers
    .sort((a, b) => sortByPerformance(a, b))
    .slice(0, 5)

  return sortedPlayers
}

module.exports = getBestPlayers
