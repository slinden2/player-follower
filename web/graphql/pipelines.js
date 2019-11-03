const matchPlayers = (positionFilter, teamFilter, nationalityFilter) => {
  const getPosition = posEnum => {
    const positions = {
      RIGHT: ['R'],
      CENTER: ['C'],
      LEFT: ['L'],
      DEFENCE: ['D'],
      FORWARD: ['L', 'R', 'C'],
      ALL: ['L', 'R', 'C', 'D'],
    }

    return positions[posEnum]
  }

  const handlePositionFilter = () => {
    if (positionFilter === 'ALL') return {}
    return { primaryPosition: { $in: getPosition(positionFilter) } }
  }

  const handleTeamFilter = () => {
    if (teamFilter === 'ALL') return {}
    return { 'team.abbreviation': teamFilter }
  }

  const handleNationalityFilter = () => {
    if (nationalityFilter === 'ALL') return {}
    return { nationality: nationalityFilter }
  }

  return {
    $match: {
      ...handlePositionFilter(),
      ...handleTeamFilter(),
      ...handleNationalityFilter(),
    },
  }
}

const calculateStats = idString => [
  {
    $group: {
      _id: `$${idString}`,
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

const bestPlayersPipeline = (
  numOfGames,
  positionFilter,
  teamFilter,
  nationalityFilter
) => [
  {
    $lookup: {
      from: 'teams',
      localField: 'currentTeam',
      foreignField: '_id',
      as: 'team',
    },
  },
  matchPlayers(positionFilter, teamFilter, nationalityFilter),
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
  ...calculateStats('_id'),
]

const reformatPlayCardData = numOfGames => [
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

const reformatSeasonStatsData = numOfGames => [
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
      timeOnIce: 1,
      assists: 1,
      goals: 1,
      points: 1,
      shots: 1,
      hits: 1,
      powerPlayGoals: 1,
      powerPlayAssists: 1,
      penaltyMinutes: 1,
      faceOffWins: 1,
      takeaways: 1,
      giveaways: 1,
      shortHandedGoals: 1,
      shortHandedAssists: 1,
      blocked: 1,
      plusMinus: 1,
      evenTimeOnIce: 1,
      powerPlayTimeOnIce: 1,
      shortHandedTimeOnIce: 1,
      faceOffsTaken: 1,
      gamesPlayed: 1,
      powerPlayPoints: 1,
      shortHandedPoints: 1,
      faceOffPct: 1,
      timeOnIcePerGame: 1,
      evenTimeOnIcePerGame: 1,
      powerPlayTimeOnIcePerGame: 1,
      shortHandedTimeOnIcePerGame: 1,
      shotsPerGame: 1,
      shotPct: 1,
      pointsPerGame: 1,
      firstName: { $arrayElemAt: ['$player.firstName', 0] },
      lastName: { $arrayElemAt: ['$player.lastName', 0] },
      siteLink: { $arrayElemAt: ['$player.siteLink', 0] },
      position: { $arrayElemAt: ['$player.primaryPosition', 0] },
      team: { $arrayElemAt: ['$team.abbreviation', 0] },
      teamSiteLink: { $arrayElemAt: ['$team.siteLink', 0] },
    },
  },
  { $addFields: { numOfGamesId: numOfGames } },
]

const playerCardSort = sortBy => {
  const sortArg =
    sortBy === 'points'
      ? { [`stats.${sortBy}`]: -1 }
      : { [`stats.${sortBy}`]: -1, 'stats.points': -1 }

  return [
    {
      $sort: {
        ...sortArg,
        'stats.goals': -1,
        'stats.plusMinus': -1,
        'player.lastName': 1,
      },
    },
    { $limit: 50 },
  ]
}

const bestPlayersAggregate = (
  numOfGames,
  positionFilter,
  teamFilter,
  nationalityFilter,
  sortBy
) => {
  const pipeline = [
    ...bestPlayersPipeline(
      numOfGames,
      positionFilter,
      teamFilter,
      nationalityFilter
    ),
    ...reformatPlayCardData(numOfGames),
    ...playerCardSort(sortBy),
  ]

  return pipeline
}

const favoritePlayersAggregate = (
  playerList,
  numOfGames,
  positionFilter,
  teamFilter,
  nationalityFilter,
  sortBy
) => {
  const pipeline = [
    {
      $match: {
        _id: { $in: playerList },
      },
    },
    ...bestPlayersPipeline(
      numOfGames,
      positionFilter,
      teamFilter,
      nationalityFilter
    ),
    ...reformatPlayCardData(numOfGames),
    ...playerCardSort(sortBy),
  ]

  return pipeline
}

const seasonStatsAggregate = (
  positionFilter,
  teamFilter,
  nationalityFilter,
  sortBy,
  sortDir,
  offset
) => {
  const numOfGames = 100

  const sortOperation =
    sortBy === 'lastName'
      ? {
        $sort: {
          lowerCaseLastName: parseInt(`${sortDir}1`) * -1,
        },
      }
      : {
        $sort: {
          [`${sortBy}`]: parseInt(`${sortDir}1`),
          lowerCaseLastName: 1,
        },
      }

  const seasonStatsSort = [
    {
      $addFields: {
        // sortCode is needed for Apollo Client cache
        sortCode: `${sortDir}${sortBy}`,
        lowerCaseLastName: { $toLower: '$lastName' },
      },
    },
    sortOperation,
    {
      $skip: offset,
    },
    {
      $limit: 50,
    },
  ]

  const pipeline = [
    ...bestPlayersPipeline(
      numOfGames,
      positionFilter,
      teamFilter,
      nationalityFilter
    ),
    ...reformatSeasonStatsData(numOfGames),
    ...seasonStatsSort,
  ]

  return pipeline
}

const teamProfileAggregate = siteLink => {
  const pipeline = [
    {
      $match: {
        siteLink,
      },
    },
    {
      $lookup: {
        from: 'players',
        localField: 'players',
        foreignField: '_id',
        as: 'populatedPlayers',
      },
    },
    { $unwind: '$populatedPlayers' },
    {
      $lookup: {
        from: 'skaterboxscores',
        localField: 'populatedPlayers.boxscores',
        foreignField: '_id',
        as: 'populatedBoxscores',
      },
    },
    {
      $project: {
        playerId: '$populatedPlayers._id',
        populatedBoxscores: 1,
      },
    },
    {
      $unwind: '$populatedBoxscores',
    },
    ...calculateStats('playerId'),
    {
      $project: {
        players: '$$ROOT',
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
      $addFields: {
        'players.firstName': { $arrayElemAt: ['$player.firstName', 0] },
        'players.lastName': { $arrayElemAt: ['$player.lastName', 0] },
        'players.siteLink': { $arrayElemAt: ['$player.siteLink', 0] },
        'players.position': { $arrayElemAt: ['$player.primaryPosition', 0] },
      },
    },
    {
      $project: {
        players: 1,
        player: { $arrayElemAt: ['$player', 0] },
        team: { $arrayElemAt: ['$team', 0] },
      },
    },
    {
      $group: {
        _id: '$team._id',
        conference: { $first: '$team.conference' },
        division: { $first: '$team.division' },
        teamId: { $first: '$team.teamid' },
        siteLink: { $first: '$team.siteLink' },
        name: { $first: '$team.name' },
        abbreviation: { $first: '$team.abbreviation' },
        players: { $push: '$players' },
      },
    },
  ]

  return pipeline
}

const teamStandingsAggregate = () => {
  const pipeline = [
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
        linescores: { $slice: ['$populatedLinescores', -100] },
      },
    },
    { $unwind: '$linescores' },
    {
      $group: {
        _id: '$_id',
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
            $cond: [
              { $and: ['$linescores.isHomeGame', '$linescores.ot'] },
              1,
              0,
            ],
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

  return pipeline
}

module.exports = {
  bestPlayersAggregate,
  favoritePlayersAggregate,
  seasonStatsAggregate,
  teamProfileAggregate,
  teamStandingsAggregate,
}
