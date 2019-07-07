const reduceStats = require('./reduce-stats')

/*
For sorting boxscore. Must be corrected to date in the future.
It is not guaranteed that gamePks are in progressive order.
*/
const sortByGameDate = (a, b) => b.gameDate - a.gameDate

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
    player.boxscores = player.boxscores.sort((a, b) => sortByGameDate(a, b))
    return player
  })

  const newPlayers = []
  for (const player of playersSorted) {
    player.stats = reduceStats(player, numOfGames)
    if (numOfGames === 1 && player.lastName === 'Giroux') {
      console.log('with stats ', player)
    }
    newPlayers.push(player)
  }

  const sortedPlayers = newPlayers
    .sort((a, b) => sortByPerformance(a, b))
    .slice(0, 5)

  return sortedPlayers.map(player => ({
    ...player,
    numOfGamesId: numOfGames,
  }))
}

module.exports = getBestPlayers
