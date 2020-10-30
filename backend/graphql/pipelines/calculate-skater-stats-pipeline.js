const calculateSkaterStatsPipeline = idString => [
  {
    $group: {
      _id: `$${idString}`,
      gamePks: { $push: '$boxscores.gamePk' },
      gamesPlayed: { $sum: 1 },
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
        $cond: [
          { $size: '$gamePks' },
          {
            $divide: ['$timeOnIce', { $size: '$gamePks' }],
          },
          0,
        ],
      },
      evenTimeOnIcePerGame: {
        $cond: [
          { $size: '$gamePks' },
          {
            $divide: ['$evenTimeOnIce', { $size: '$gamePks' }],
          },
          0,
        ],
      },
      powerPlayTimeOnIcePerGame: {
        $cond: [
          { $size: '$gamePks' },
          {
            $divide: ['$powerPlayTimeOnIce', { $size: '$gamePks' }],
          },
          0,
        ],
      },
      shortHandedTimeOnIcePerGame: {
        $cond: [
          { $size: '$gamePks' },
          {
            $divide: ['$shortHandedTimeOnIce', { $size: '$gamePks' }],
          },
          0,
        ],
      },
      shotsPerGame: {
        $cond: [
          { $size: '$gamePks' },
          {
            $divide: ['$shots', { $size: '$gamePks' }],
          },
          0,
        ],
      },
      shotPct: {
        $cond: [
          '$shots' && '$goals',
          { $multiply: [{ $divide: ['$goals', '$shots'] }, 100] },
          0,
        ],
      },
      pointsPerGame: {
        $cond: [
          { $size: '$gamePks' },
          {
            $divide: ['$points', { $size: '$gamePks' }],
          },
          0,
        ],
      },
    },
  },
]

module.exports = calculateSkaterStatsPipeline
