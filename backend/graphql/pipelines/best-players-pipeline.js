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
      gamesPlayed: { $sum: 1 },
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
      goalsAgainstAverage: {
        $cond: [
          { $size: '$gamePks' },
          { $divide: ['$goalsAgainst', { $size: '$gamePks' }] },
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
      timeOnIcePerGame: {
        $cond: [
          { $size: '$gamePks' },
          { $divide: ['$timeOnIce', { $size: '$gamePks' }] },
          0,
        ],
      },
      savesPerGame: {
        $cond: [
          { $size: '$gamePks' },
          { $divide: ['$saves', { $size: '$gamePks' }] },
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
      winPct: {
        $cond: [
          { $size: '$gamePks' },
          { $multiply: [{ $divide: ['$wins', { $size: '$gamePks' }] }, 100] },
          0,
        ],
      },
    },
  },
]

const bestPlayersPipeline = ({
  numOfGames,
  positionFilter,
  teamFilter,
  nationalityFilter,
  siteLink,
  seasonId,
}) => {
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
        populatedBoxscores: {
          $filter: {
            input: '$populatedBoxscores',
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
