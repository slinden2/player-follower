const matchPlayers = (
  positionFilter,
  teamFilter,
  nationalityFilter,
  siteLink
) => {
  const getPosition = posEnum => {
    const positions = {
      GOALIE: ['G'],
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

  // If sitelink is provided, no other filters are needed
  // Every player has a unique siteLink
  if (siteLink) {
    return {
      $match: {
        siteLink,
      },
    }
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

const calculateGoalieStats = idString => [
  {
    $group: {
      _id: `$${idString}`,
      gamePks: { $push: '$populatedBoxscores.gamePk' },
      gamesPlayed: { $sum: 1 },
      timeOnIce: { $sum: '$populatedBoxscores.timeOnIce' },
      assists: { $sum: '$populatedBoxscores.assists' },
      goals: { $sum: '$populatedBoxscores.goals' },
      saves: { $sum: '$populatedBoxscores.saves' },
      evenSaves: { $sum: '$populatedBoxscores.evenSaves' },
      powerPlaySaves: { $sum: '$populatedBoxscores.powerPlaySaves' },
      shortHandedSaves: { $sum: '$populatedBoxscores.shortHandedSaves' },
      shotsAgainst: { $sum: '$populatedBoxscores.shotsAgainst' },
      powerPlayShotsAgainst: {
        $sum: '$populatedBoxscores.powerPlayShotsAgainst',
      },
      shortHandedShotsAgainst: {
        $sum: '$populatedBoxscores.shortHandedShotsAgainst',
      },
      wins: {
        $sum: { $cond: [{ $eq: ['$populatedBoxscores.decision', 'W'] }, 1, 0] },
      },
      losses: {
        $sum: { $cond: [{ $eq: ['$populatedBoxscores.decision', 'L'] }, 1, 0] },
      },
      penaltyMinutes: { $sum: '$populatedBoxscores.penaltyMinutes' },
      goalsAgainst: {
        $sum: {
          $subtract: [
            '$populatedBoxscores.shotsAgainst',
            '$populatedBoxscores.saves',
          ],
        },
      },
      shutouts: {
        $sum: {
          $cond: [
            {
              $eq: [
                {
                  $subtract: [
                    '$populatedBoxscores.shotsAgainst',
                    '$populatedBoxscores.saves',
                  ],
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
      goalsAgainstAverage: { $divide: ['$goalsAgainst', '$gamesPlayed'] },
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

const bestPlayersPipeline = (
  numOfGames,
  positionFilter,
  teamFilter,
  nationalityFilter,
  siteLink
) => {
  const bsField =
    positionFilter === 'GOALIE' ? 'goalieboxscores' : 'skaterboxscores'
  const calcStats =
    positionFilter === 'GOALIE' ? calculateGoalieStats : calculateStats
  return [
    {
      $lookup: {
        from: 'teams',
        localField: 'currentTeam',
        foreignField: '_id',
        as: 'team',
      },
    },
    matchPlayers(positionFilter, teamFilter, nationalityFilter, siteLink),
    {
      $lookup: {
        from: bsField,
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
    ...calcStats('_id'),
  ]
}

module.exports = bestPlayersPipeline