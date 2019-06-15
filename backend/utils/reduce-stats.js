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

/*
The function returns the total stats of a player for the last
`numOfGames`. If no `numOfGames` is given, or if `numOfGames`
is greated than the number of games played, the function just
returns the sum of all stats.
*/
const reduceStats = (player, numOfGames) => {
  if (player.boxscores.length === 1) return player.boxscores[0]
  if (numOfGames < player.boxscores.length) {
    player.boxscores = player.boxscores.slice(-numOfGames)
  }
  const stats = player.boxscores.reduce((acc, cur) => {
    for (const field in cur) {
      if (FIELDS.includes(field)) {
        acc[field] = acc[field] + cur[field]
      }
    }
    return acc
  })
  return stats
}

module.exports = reduceStats
