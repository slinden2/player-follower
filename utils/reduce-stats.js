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

const reduceStats = player => {
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
