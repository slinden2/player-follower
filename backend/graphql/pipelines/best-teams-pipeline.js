const calculateTeamStats = idString => [
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
        $multiply: [
          { $divide: ['$points', { $multiply: ['$gamesPlayed', 2] }] },
          100,
        ],
      },
      goalDiff: { $subtract: ['$goalsFor', '$goalsAgainst'] },
      goalsForPerGame: { $divide: ['$goalsFor', '$gamesPlayed'] },
      goalsAgainstPerGame: { $divide: ['$goalsAgainst', '$gamesPlayed'] },
      ppPct: {
        $multiply: [
          { $divide: ['$powerPlayGoals', '$powerPlayOpportunities'] },
          100,
        ],
      },
      pkPct: {
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
      shotsForPerGame: { $divide: ['$shotsFor', '$gamesPlayed'] },
      shotsAgainstPerGame: { $divide: ['$shotsAgainst', '$gamesPlayed'] },
      faceOffWinPct: {
        $multiply: [{ $divide: ['$faceOffWins', '$faceOffsTaken'] }, 100],
      },
      hitsForPerGame: { $divide: ['$hitsFor', '$gamesPlayed'] },
      hitsAgainstPerGame: { $divide: ['$hitsAgainst', '$gamesPlayed'] },
    },
  },
]

const bestTeamsPipeline = (numOfGames, seasonId) => {
  return [
    {
      $lookup: {
        from: 'conferences',
        localField: 'conference',
        foreignField: '_id',
        as: 'conference',
      },
    },
    {
      $lookup: {
        from: 'divisions',
        localField: 'division',
        foreignField: '_id',
        as: 'division',
      },
    },
    {
      $lookup: {
        from: 'linescores',
        localField: 'linescores',
        foreignField: '_id',
        as: 'populatedLinescores',
      },
    },
    {
      $project: {
        populatedLinescores: {
          $filter: {
            input: '$populatedLinescores',
            cond: {
              $regexMatch: {
                input: { $toString: '$$this.gamePk' },
                regex: new RegExp(`^${seasonId}`),
              },
            },
          },
        },
      },
    },
    {
      $project: {
        linescores: { $slice: ['$populatedLinescores', -numOfGames] },
      },
    },
    { $unwind: '$linescores' },
    ...calculateTeamStats('_id'),
  ]
}

module.exports = bestTeamsPipeline
