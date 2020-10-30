const calculateGoalieStatsPipeline = idString => [
  {
    $group: {
      _id: `$${idString}`,
      gamePks: { $push: '$boxscores.gamePk' },
      gamesPlayed: { $sum: 1 },
      timeOnIce: { $sum: '$boxscores.timeOnIce' },
      assists: { $sum: '$boxscores.assists' },
      goals: { $sum: '$boxscores.goals' },
      saves: { $sum: '$boxscores.saves' },
      evenSaves: { $sum: '$boxscores.evenSaves' },
      powerPlaySaves: { $sum: '$boxscores.powerPlaySaves' },
      shortHandedSaves: { $sum: '$boxscores.shortHandedSaves' },
      shotsAgainst: { $sum: '$boxscores.shotsAgainst' },
      powerPlayShotsAgainst: {
        $sum: '$boxscores.powerPlayShotsAgainst',
      },
      shortHandedShotsAgainst: {
        $sum: '$boxscores.shortHandedShotsAgainst',
      },
      wins: {
        $sum: { $cond: [{ $eq: ['$boxscores.decision', 'W'] }, 1, 0] },
      },
      losses: {
        $sum: { $cond: [{ $eq: ['$boxscores.decision', 'L'] }, 1, 0] },
      },
      penaltyMinutes: { $sum: '$boxscores.penaltyMinutes' },
      goalsAgainst: {
        $sum: {
          $subtract: ['$boxscores.shotsAgainst', '$boxscores.saves'],
        },
      },
      shutouts: {
        $sum: {
          $cond: [
            {
              $eq: [
                {
                  $subtract: ['$boxscores.shotsAgainst', '$boxscores.saves'],
                },
                0,
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  },
  {
    $addFields: {
      goalsAgainstAverage: {
        $cond: [
          { $size: '$gamePks' },
          { $divide: ['$goalsAgainst', '$gamesPlayed'] },
          0,
        ],
      },
      savePct: {
        $cond: [
          '$shotsAgainst',
          {
            $multiply: [
              {
                $divide: ['$saves', '$shotsAgainst'],
              },
              100,
            ],
          },
          0,
        ],
      },
      powerPlaySavePct: {
        $cond: [
          '$powerPlayShotsAgainst',
          {
            $multiply: [
              {
                $divide: ['$powerPlaySaves', '$powerPlayShotsAgainst'],
              },
              100,
            ],
          },
          0,
        ],
      },
      shortHandedSavePct: {
        $cond: [
          '$shortHandedShotsAgainst',
          {
            $multiply: [
              {
                $divide: ['$shortHandedSaves', '$shortHandedShotsAgainst'],
              },
              100,
            ],
          },
          0,
        ],
      },
      timeOnIcePerGame: { $divide: ['$timeOnIce', '$gamesPlayed'] },
      savesPerGame: { $divide: ['$saves', '$gamesPlayed'] },
      shotsAgainstPerGame: { $divide: ['$shotsAgainst', '$gamesPlayed'] },
      winPct: { $multiply: [{ $divide: ['$wins', '$gamesPlayed'] }, 100] },
    },
  },
]

module.exports = calculateGoalieStatsPipeline
