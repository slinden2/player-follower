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

const bestTeamsPipeline = numOfGames => [
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
      linescores: { $slice: ['$populatedLinescores', -numOfGames] },
    },
  },
  { $unwind: '$linescores' },
  ...calculateTeamStats('_id'),
]

const reformatStandingsData = () => [
  {
    $lookup: {
      from: 'teams',
      localField: '_id',
      foreignField: '_id',
      as: 'team',
    },
  },
  {
    $lookup: {
      from: 'conferences',
      localField: 'team.conference',
      foreignField: '_id',
      as: 'conference',
    },
  },
  {
    $lookup: {
      from: 'divisions',
      localField: 'team.division',
      foreignField: '_id',
      as: 'division',
    },
  },
  {
    $project: {
      team: { $arrayElemAt: ['$team', 0] },
      conference: { $arrayElemAt: ['$conference', 0] },
      division: { $arrayElemAt: ['$division', 0] },
      gamePks: 1,
      gamesPlayed: 1,
      wins: 1,
      winsHome: 1,
      winsAway: 1,
      otWins: 1,
      shootOutWins: 1,
      losses: 1,
      lossesHome: 1,
      lossesAway: 1,
      otLosses: 1,
      otLossesHome: 1,
      otLossesAway: 1,
      points: 1,
      goalsFor: 1,
      goalsAgainst: 1,
      goalDiff: 1,
      penaltyMinutes: 1,
      shotsFor: 1,
      shotsAgainst: 1,
      powerPlayGoals: 1,
      powerPlayOpportunities: 1,
      powerPlayGoalsAllowed: 1,
      powerPlayOpportunitiesAllowed: 1,
      faceOffsTaken: 1,
      faceOffWins: 1,
      blocked: 1,
      takeaways: 1,
      giveaways: 1,
      hitsFor: 1,
      hitsAgainst: 1,
      regWins: 1,
      regPlusOtWins: 1,
      pointPct: 1,
      goalsForPerGame: 1,
      goalsAgainstPerGame: 1,
      ppPct: 1,
      pkPct: 1,
      shotsForPerGame: 1,
      shotsAgainstPerGame: 1,
      faceOffWinPct: 1,
      hitsForPerGame: 1,
      hitsAgainstPerGame: 1,
    },
  },
  {
    $addFields: {
      teamName: '$team.name',
      teamAbbr: '$team.abbreviation',
      teamSiteLink: '$team.siteLink',
    },
  },
  {
    $project: {
      team: 0,
      'conference.divisions': 0,
      'conference.teams': 0,
      'division.conference': 0,
      'division.teams': 0,
    },
  },
  {
    $sort: {
      wins: -1,
      points: -1,
      goalDiff: -1,
      gamesPlayed: 1,
    },
  },
]

const reformatTeamCardData = numOfGames => [
  {
    $project: {
      stats: '$$ROOT',
    },
  },
  {
    $lookup: {
      from: 'teams',
      localField: '_id',
      foreignField: '_id',
      as: 'team',
    },
  },
  {
    $lookup: {
      from: 'divisions',
      localField: 'team.division',
      foreignField: '_id',
      as: 'division',
    },
  },
  {
    $lookup: {
      from: 'conferences',
      localField: 'team.conference',
      foreignField: '_id',
      as: 'conference',
    },
  },
  {
    $project: {
      stats: 1,
      team: { $arrayElemAt: ['$team', 0] },
      division: { $arrayElemAt: ['$division', 0] },
      conference: { $arrayElemAt: ['$conference', 0] },
    },
  },
  {
    $project: {
      'team.players': 0,
      'team.stats': 0,
      'team.conference': 0,
      'team.division': 0,
      'team.linescores': 0,
      'conference.teams': 0,
      'conference.divisions': 0,
      'division.conference': 0,
      'division.teams': 0,
    },
  },
  { $addFields: { numOfGamesId: numOfGames } },
]

const teamStandingsAggregate = () => {
  const pipeline = [
    ...bestTeamsPipeline(100, 'ALL', 'ALL'),
    ...reformatStandingsData(),
    {
      $sort: {
        wins: -1,
        points: -1,
        goalDiff: -1,
        gamesPlayed: 1,
      },
    },
  ]

  return pipeline
}

const bestTeamsAggregate = numOfGames => {
  const pipeline = [
    ...bestTeamsPipeline(numOfGames),
    ...reformatTeamCardData(numOfGames),
    {
      $sort: {
        'stats.wins': -1,
        'stats.points': -1,
        'stats.goalDiff': -1,
        'stats.gamesPlayed': 1,
      },
    },
  ]

  return pipeline
}

module.exports = {
  teamStandingsAggregate,
  bestTeamsAggregate,
}
