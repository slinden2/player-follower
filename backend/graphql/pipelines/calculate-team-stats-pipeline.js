const calculateTeamStatsPipeline = idString => [
  {
    $group: {
      _id: `$${idString}`,
      gamePks: { $push: '$linescores.gamePk' },
      gamesPlayed: { $sum: 1 },
      wins: { $sum: { $cond: ['$linescores.win', 1, 0] } },
      winsHome: {
        $sum: {
          $cond: [
            { $and: ['$linescores.isHomeGame', '$linescores.win'] },
            1,
            0,
          ],
        },
      },
      winsAway: {
        $sum: {
          $cond: [
            { $and: [{ $not: '$linescores.isHomeGame' }, '$linescores.win'] },
            1,
            0,
          ],
        },
      },
      otWins: { $sum: { $cond: ['$linescores.otWin', 1, 0] } },
      shootOutWins: { $sum: { $cond: ['$linescores.shootOutWin', 1, 0] } },
      losses: { $sum: { $cond: ['$linescores.loss', 1, 0] } },
      lossesHome: {
        $sum: {
          $cond: [
            { $and: ['$linescores.isHomeGame', '$linescores.loss'] },
            1,
            0,
          ],
        },
      },
      lossesAway: {
        $sum: {
          $cond: [
            {
              $and: [{ $not: '$linescores.isHomeGame' }, '$linescores.loss'],
            },
            1,
            0,
          ],
        },
      },
      otLosses: { $sum: { $cond: ['$linescores.ot', 1, 0] } },
      otLossesHome: {
        $sum: {
          $cond: [{ $and: ['$linescores.isHomeGame', '$linescores.ot'] }, 1, 0],
        },
      },
      otLossesAway: {
        $sum: {
          $cond: [
            { $and: [{ $not: '$linescores.isHomeGame' }, '$linescores.ot'] },
            1,
            0,
          ],
        },
      },
      points: { $sum: '$linescores.points' },
      goalsFor: { $sum: '$linescores.goalsFor' },
      goalsAgainst: { $sum: '$linescores.goalsAgainst' },
      penaltyMinutes: {
        $sum: '$linescores.penaltyMinutes',
      },
      shotsFor: { $sum: '$linescores.shotsFor' },
      shotsAgainst: { $sum: '$linescores.shotsAgainst' },
      powerPlayGoals: {
        $sum: '$linescores.powerPlayGoals',
      },
      powerPlayOpportunities: {
        $sum: '$linescores.powerPlayOpportunities',
      },
      powerPlayGoalsAllowed: {
        $sum: '$linescores.powerPlayGoalsAllowed',
      },
      powerPlayOpportunitiesAllowed: {
        $sum: '$linescores.powerPlayOpportunitiesAllowed',
      },
      faceOffsTaken: { $sum: '$linescores.faceOffsTaken' },
      faceOffWins: { $sum: '$linescores.faceOffWins' },
      blocked: { $sum: '$linescores.blocked' },
      takeaways: { $sum: '$linescores.takeaways' },
      giveaways: { $sum: '$linescores.giveaways' },
      hitsFor: { $sum: '$linescores.hitsFor' },
      hitsAgainst: { $sum: '$linescores.hitsAgainst' },
    },
  },
  {
    $addFields: {
      regWins: {
        $subtract: ['$wins', { $add: ['$otWins', '$shootOutWins'] }],
      },
      regPlusOtWins: {
        $subtract: ['$wins', '$shootOutWins'],
      },
      pointPct: {
        $cond: [
          { $size: '$gamePks' },
          {
            $multiply: [
              {
                $divide: ['$points', { $multiply: [{ $size: '$gamePks' }, 2] }],
              },
              100,
            ],
          },
          0,
        ],
      },
      goalDiff: { $subtract: ['$goalsFor', '$goalsAgainst'] },
      goalsForPerGame: {
        $cond: [
          { $size: '$gamePks' },
          { $divide: ['$goalsFor', { $size: '$gamePks' }] },
          0,
        ],
      },
      goalsAgainstPerGame: {
        $cond: [
          { $size: '$gamePks' },
          { $divide: ['$goalsAgainst', { $size: '$gamePks' }] },
          0,
        ],
      },
      ppPct: {
        $cond: [
          '$powerPlayOpportunities',
          {
            $multiply: [
              { $divide: ['$powerPlayGoals', '$powerPlayOpportunities'] },
              100,
            ],
          },
          0,
        ],
      },
      pkPct: {
        $cond: [
          '$powerPlayOpportunitiesAllowed',
          {
            $subtract: [
              100,
              {
                $multiply: [
                  {
                    $divide: [
                      '$powerPlayGoalsAllowed',
                      '$powerPlayOpportunitiesAllowed',
                    ],
                  },
                  100,
                ],
              },
            ],
          },
          0,
        ],
      },
      shotsForPerGame: {
        $cond: [
          { $size: '$gamePks' },
          { $divide: ['$shotsFor', { $size: '$gamePks' }] },
          0,
        ],
      },
      shotsAgainstPerGame: {
        $cond: [
          { $size: '$gamePks' },
          { $divide: ['$shotsAgainst', { $size: '$gamePks' }] },
          0,
        ],
      },
      faceOffWinPct: {
        $cond: [
          '$faceOffsTaken',
          {
            $multiply: [{ $divide: ['$faceOffWins', '$faceOffsTaken'] }, 100],
          },
          0,
        ],
      },
      hitsForPerGame: {
        $cond: [
          { $size: '$gamePks' },
          { $divide: ['$hitsFor', { $size: '$gamePks' }] },
          0,
        ],
      },
      hitsAgainstPerGame: {
        $cond: [
          { $size: '$gamePks' },
          { $divide: ['$hitsAgainst', { $size: '$gamePks' }] },
          0,
        ],
      },
    },
  },
]

module.exports = calculateTeamStatsPipeline
