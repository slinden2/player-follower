const calculateSkaterStatsPipeline = idString => [
  {
    $group: {
      _id: `$${idString}`,
      gamePks: { $push: '$boxscores.gamePk' },
      timeOnIce: { $sum: '$boxscores.timeOnIce' },
      assists: { $sum: '$boxscores.assists' },
      goals: { $sum: '$boxscores.goals' },
      points: { $sum: '$boxscores.points' },
      shots: { $sum: '$boxscores.shots' },
      hits: { $sum: '$boxscores.hits' },
      powerPlayGoals: { $sum: '$boxscores.powerPlayGoals' },
      powerPlayAssists: { $sum: '$boxscores.powerPlayAssists' },
      penaltyMinutes: { $sum: '$boxscores.penaltyMinutes' },
      faceOffWins: { $sum: '$boxscores.faceOffWins' },
      takeaways: { $sum: '$boxscores.takeaways' },
      giveaways: { $sum: '$boxscores.giveaways' },
      shortHandedGoals: { $sum: '$boxscores.shortHandedGoals' },
      shortHandedAssists: {
        $sum: '$boxscores.shortHandedAssists',
      },
      blocked: { $sum: '$boxscores.blocked' },
      plusMinus: { $sum: '$boxscores.plusMinus' },
      evenTimeOnIce: { $sum: '$boxscores.evenTimeOnIce' },
      powerPlayTimeOnIce: {
        $sum: '$boxscores.powerPlayTimeOnIce',
      },
      shortHandedTimeOnIce: {
        $sum: '$boxscores.shortHandedTimeOnIce',
      },
      faceOffsTaken: { $sum: '$boxscores.faceOffsTaken' },
    },
  },
  {
    $addFields: {
      gamesPlayed: { $size: '$gamePks' },
      powerPlayPoints: { $add: ['$powerPlayGoals', '$powerPlayAssists'] },
      shortHandedPoints: {
        $add: ['$shortHandedGoals', '$shortHandedAssists'],
      },
      faceOffPct: {
        $cond: [
          '$faceOffsTaken',
          { $multiply: [{ $divide: ['$faceOffWins', '$faceOffsTaken'] }, 100] },
          0,
        ],
      },
      timeOnIcePerGame: {
        $divide: ['$timeOnIce', { $size: '$gamePks' }],
      },
      evenTimeOnIcePerGame: {
        $divide: ['$evenTimeOnIce', { $size: '$gamePks' }],
      },
      powerPlayTimeOnIcePerGame: {
        $divide: ['$powerPlayTimeOnIce', { $size: '$gamePks' }],
      },
      shortHandedTimeOnIcePerGame: {
        $divide: ['$shortHandedTimeOnIce', { $size: '$gamePks' }],
      },
      shotsPerGame: {
        $divide: ['$shots', { $size: '$gamePks' }],
      },
      shotPct: {
        $cond: [
          '$shots' && '$goals',
          { $multiply: [{ $divide: ['$goals', '$shots'] }, 100] },
          0,
        ],
      },
      pointsPerGame: {
        $divide: ['$points', { $size: '$gamePks' }],
      },
    },
  },
]

module.exports = calculateSkaterStatsPipeline
