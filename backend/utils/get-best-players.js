const { reduceStats } = require('./reduce-stats')

/*
For sorting boxscore. Must be corrected to date in the future.
It is not guaranteed that gamePks are in progressive order.
*/
const sortByGameDate = boxscores => {
  return boxscores.sort((a, b) => {
    return a.gameDate > b.gameDate ? -1 : 1
  })
}

const sortByPerformance = players => {
  return players.sort(
    (a, b) =>
      b.stats.points - a.stats.points ||
      b.stats.goals - a.stats.goals ||
      b.stats.plusMinus - a.stats.plusMinus
  )
}

/*
The function consumes a raw list of players from the db and
calculates accumalative stats for a X number of games. The games
are automatically picked in descending order (most recent game first).
Returns a list of 5 players performance order.
*/
const getBestPlayers = (players, numOfGames) => {
  const playersJSON = JSON.parse(JSON.stringify(players))

  const playersSorted = playersJSON.map(player => {
    player.boxscores = sortByGameDate(player.boxscores)
    return player
  })

  const newPlayers = []
  for (const player of playersSorted) {
    if (player.boxscores.length < 1) continue
    player.stats = reduceStats(player, numOfGames)
    newPlayers.push(player)
  }

  const sortedPlayers = sortByPerformance(newPlayers)

  return sortedPlayers
    .map(player => ({
      ...player,
      numOfGamesId: numOfGames,
    }))
    .slice(0, 15)
}

module.exports =
  process.env.NODE_ENV !== 'test'
    ? { getBestPlayers }
    : { getBestPlayers, sortByGameDate, sortByPerformance }
