const bestTeamsPipeline = require('./pipelines/best-teams-pipeline')

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

module.exports = bestTeamsAggregate
