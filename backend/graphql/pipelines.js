const matchObject = (positionFilter, teamFilter) => {
  const playerPos =
    positionFilter === 'DEFENCE'
      ? ['D']
      : positionFilter === 'FORWARD'
        ? ['L', 'R', 'C']
        : ['L', 'R', 'C', 'D']

  return teamFilter !== 'ALL'
    ? {
      $match: {
        'team.abbreviation': teamFilter,
        primaryPosition: { $in: playerPos },
      },
    }
    : {
      $match: {
        primaryPosition: { $in: playerPos },
      },
    }
}

const bestPlayersPipeline = (numOfGames, positionFilter, teamFilter) => [
  {
    $lookup: {
      from: 'teams',
      localField: 'currentTeam',
      foreignField: '_id',
      as: 'team',
    },
  },
  matchObject(positionFilter, teamFilter),
  {
    $lookup: {
      from: 'skaterboxscores',
      localField: 'boxscores',
      foreignField: '_id',
      as: 'populatedBoxscores',
    },
  },
  {
    $project: {
      firstName: 1,
      lastName: 1,
      populatedBoxscores: { $slice: ['$populatedBoxscores', -numOfGames] },
    },
  },
  { $unwind: '$populatedBoxscores' },
  {
    $group: {
      _id: '$_id',
      gamePks: { $push: '$populatedBoxscores.gamePk' },
      timeOnIce: { $sum: '$populatedBoxscores.timeOnIce' },
      assists: { $sum: '$populatedBoxscores.assists' },
      goals: { $sum: '$populatedBoxscores.goals' },
      points: { $sum: '$populatedBoxscores.points' },
      shots: { $sum: '$populatedBoxscores.shots' },
      hits: { $sum: '$populatedBoxscores.hits' },
      powerPlayGoals: { $sum: '$populatedBoxscores.powerPlayGoals' },
      powerPlayAssists: { $sum: '$populatedBoxscores.powerPlayAssists' },
      penaltyMinutes: { $sum: '$populatedBoxscores.penaltyMinutes' },
      faceOffWins: { $sum: '$populatedBoxscores.faceOffWins' },
      takeaways: { $sum: '$populatedBoxscores.takeaways' },
      giveaways: { $sum: '$populatedBoxscores.giveaways' },
      shortHandedGoals: { $sum: '$populatedBoxscores.shortHandedGoals' },
      shortHandedAssists: {
        $sum: '$populatedBoxscores.shortHandedAssists',
      },
      blocked: { $sum: '$populatedBoxscores.blocked' },
      plusMinus: { $sum: '$populatedBoxscores.plusMinus' },
      evenTimeOnIce: { $sum: '$populatedBoxscores.evenTimeOnIce' },
      powerPlayTimeOnIce: {
        $sum: '$populatedBoxscores.powerPlayTimeOnIce',
      },
      shortHandedTimeOnIce: {
        $sum: '$populatedBoxscores.shortHandedTimeOnIce',
      },
      faceOffsTaken: { $sum: '$populatedBoxscores.faceOffsTaken' },
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
          { $divide: ['$faceOffWins', '$faceOffsTaken'] },
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
    },
  },
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
  {
    $sort: {
      'stats.points': -1,
      'stats.goals': -1,
      'stats.plusMinus': -1,
      'player.lastName': 1,
    },
  },
  { $limit: 50 },
]

const bestPlayersAggregate = (numOfGames, positionFilter, teamFilter) => {
  const pipeline = [
    ...bestPlayersPipeline(numOfGames, positionFilter, teamFilter),
  ]

  return pipeline
}

const favoritePlayersAggregate = (
  numOfGames,
  positionFilter,
  teamFilter,
  user
) => {
  const pipeline = [
    {
      $match: {
        _id: { $in: user.favoritePlayers },
      },
    },
    ...bestPlayersPipeline(numOfGames, positionFilter, teamFilter),
  ]

  return pipeline
}

module.exports = { bestPlayersAggregate, favoritePlayersAggregate }
