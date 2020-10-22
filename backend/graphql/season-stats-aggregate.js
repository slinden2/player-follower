const bestPlayersPipeline = require('./pipelines/best-players-pipeline')

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

const seasonStatsAggregate = (
  positionFilter,
  teamFilter,
  nationalityFilter,
  sortBy,
  sortDir,
  offset,
  siteLink
) => {
  const numOfGames = 100

  // Default sort direction must be inverted for last name, because
  // otherwise the first sortDir would be from Z to A.
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
    ...bestPlayersPipeline({
      numOfGames,
      positionFilter,
      teamFilter,
      nationalityFilter,
      siteLink,
    }),
    ...reformatSeasonStatsData(numOfGames),
    ...seasonStatsSort,
  ]

  return pipeline
}

module.exports = seasonStatsAggregate
