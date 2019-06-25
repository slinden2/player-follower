const roundToOneDecimal = require('./round-to-one-decimal')

const FIELDS = [
  'timeOnIce',
  'assists',
  'goals',
  'shots',
  'hits',
  'powerPlayGoals',
  'powerPlayAssists',
  'penaltyMinutes',
  'faceOffWins',
  'faceoffTaken',
  'takeaways',
  'giveaways',
  'shortHandedGoals',
  'shortHandedAssists',
  'blocked',
  'plusMinus',
  'evenTimeOnIce',
  'powerPlayTimeOnIce',
  'shortHandedTimeOnIce',
  'saves',
  'powerPlaySaves',
  'shortHandedSaves',
  'evenSaves',
  'shortHandedShotsAgainst',
  'evenShotsAgainst',
  'powerPlayShotsAgainst',
]

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
    player.boxscores = player.boxscores.slice(-numOfGames)
  }
  const stats = player.boxscores.reduce((acc, cur) => {
    for (const field in cur) {
      if (FIELDS.includes(field)) {
        acc[field] = acc[field] + cur[field]
      }
    }
    delete acc.gamePk
    delete acc.date
    return acc
  })

  const statsWithPercentuals = generatePerGameStats(player, stats, numOfGames)

  return statsWithPercentuals
}

module.exports = reduceStats
