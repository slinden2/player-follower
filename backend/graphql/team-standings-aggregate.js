const bestTeamsPipeline = require('./pipelines/best-teams-pipeline')

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

const teamStandingsAggregate = seasonId => {
  const pipeline = [
    ...bestTeamsPipeline(100, seasonId),
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

module.exports = teamStandingsAggregate
