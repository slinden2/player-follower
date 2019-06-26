const roundToOneDecimal = require('./round-to-one-decimal')

const EXCLUDED_FIELDS = ['gamePk', 'date', 'decision', 'id']

const generatePerGameStats = (player, stats, numOfGames) => {
  if (stats.saves) {
    stats.savePctTotal = roundToOneDecimal((stats.saves / stats.shots) * 100)
  }

  const games = numOfGames ? numOfGames : player.boxscores.length

  stats.timeOnIcePerGame = Math.round(stats.timeOnIce / games)
  stats.evenTimeOnIcePerGame = Math.round(stats.evenTimeOnIce / games)
  stats.powerPlayTimeOnIcePerGame = Math.round(stats.powerPlayTimeOnIce / games)
  stats.shortHandedTimeOnIcePerGame = Math.round(
    stats.shortHandedTimeOnIce / games
  )

  return stats
}

/*
The function returns the total stats of a player for the last
`numOfGames`. If no `numOfGames` is given, or if `numOfGames`
is greater than the number of games played, the function just
returns the sum of all stats.
*/
const reduceStats = (player, numOfGames) => {
  if (numOfGames < player.boxscores.length) {
    player.boxscores = player.boxscores.slice(0, numOfGames)
  }
  console.log('=========================')
  console.log(player.firstName)
  console.log(player.boxscores)
  const stats = player.boxscores.reduce((acc, cur) => {
    if (!acc.gamePks) acc.gamePks = [acc.gamePk]
    for (const field in cur) {
      if (!EXCLUDED_FIELDS.includes(field)) {
        acc[field] += cur[field]
      }
    }
    acc.points = acc.goals + acc.assists
    acc.gamePks.push(cur.gamePk)

    delete acc.gamePk
    delete acc.date
    return acc
  })

  const statsWithPercentuals = generatePerGameStats(player, stats, numOfGames)
  return statsWithPercentuals
}

module.exports = reduceStats
