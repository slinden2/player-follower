const roundToOneDecimal = require('./round-to-one-decimal')

const EXCLUDED_FIELDS = ['gamePk', 'date', 'decision', 'id']

const generatePerGameStats = (stats, numOfGames) => {
  if (stats.saves) {
    stats.savePctTotal = roundToOneDecimal((stats.saves / stats.shots) * 100)
  }

  // const games = numOfGames ? numOfGames : player.boxscores.length

  stats.timeOnIcePerGame = Math.round(stats.timeOnIce / numOfGames)
  stats.evenTimeOnIcePerGame = Math.round(stats.evenTimeOnIce / numOfGames)
  stats.powerPlayTimeOnIcePerGame = Math.round(
    stats.powerPlayTimeOnIce / numOfGames
  )
  stats.shortHandedTimeOnIcePerGame = Math.round(
    stats.shortHandedTimeOnIce / numOfGames
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

  // If numOfGames is 1 the reduce method won't run.
  // Handle one game stats separately.
  if (numOfGames === 1) {
    stats.points = stats.goals + stats.assists
    stats.gamePks = [stats.gamePk]
    delete stats.gamePk
    delete stats.date
    delete stats.id
    delete stats.decision
  }

  const statsWithPercentuals = generatePerGameStats(stats, numOfGames)
  return statsWithPercentuals
}

module.exports =
  process.env.NODE_ENV !== 'test'
    ? reduceStats
    : { reduceStats, generatePerGameStats }
