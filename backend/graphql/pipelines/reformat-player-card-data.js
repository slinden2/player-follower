const reformatPlayerCardData = numOfGames => [
  {
    $project: {
      stats: '$$ROOT',
    },
  },
  {
    $lookup: {
      from: 'players',
      localField: '_id',
      foreignField: '_id',
      as: 'player',
    },
  },
  {
    $lookup: {
      from: 'teams',
      localField: 'player.currentTeam',
      foreignField: '_id',
      as: 'team',
    },
  },
  {
    $project: {
      stats: 1,
      player: { $arrayElemAt: ['$player', 0] },
      team: { $arrayElemAt: ['$team', 0] },
    },
  },
  { $addFields: { numOfGamesId: numOfGames } },
  {
    $project: {
      'stats._id': 0,
      'player._id': 0,
      'player.boxscores': 0,
      'player.stats': 0,
      'team.players': 0,
      'team.stats': 0,
    },
  },
]

module.exports = reformatPlayerCardData
