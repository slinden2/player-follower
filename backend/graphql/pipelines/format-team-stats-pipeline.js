const formatTeamStatsPipeline = () => {
  return [
    // Create an embedded documents for stats
    {
      $project: {
        stats: '$$ROOT',
      },
    },
    // Get team
    {
      $lookup: {
        from: 'teams',
        localField: 'stats._id',
        foreignField: '_id',
        as: 'team',
      },
    },
    // Populate each individual linescore
    {
      $lookup: {
        from: 'linescores',
        localField: 'team.linescores',
        foreignField: '_id',
        as: 'linescores',
      },
    },
    // Unwind by the array of linescores so that we can populate opponent fields
    {
      $unwind: '$linescores',
    },
    // Populate opponentId
    {
      $lookup: {
        from: 'teams',
        localField: 'linescores.opponentId',
        foreignField: '_id',
        as: 'linescores.opponentId',
      },
    },
    // Take opponent documents out of arrays
    {
      $project: {
        team: 1,
        stats: 1,
        'linescores.win': 1,
        'linescores.otWin': 1,
        'linescores.shootOutWin': 1,
        'linescores.loss': 1,
        'linescores.ot': 1,
        'linescores.opponentId': {
          $arrayElemAt: ['$linescores.opponentId', 0],
        },
        'linescores.gamePk': 1,
        'linescores.isHomeGame': 1,
        'linescores.points': 1,
        'linescores.goalsFor': 1,
        'linescores.goalsAgainst': 1,
        'linescores.penaltyMinutes': 1,
        'linescores.shotsFor': 1,
        'linescores.shotsAgainst': 1,
        'linescores.powerPlayGoals': 1,
        'linescores.powerPlayGoalsAllowed': 1,
        'linescores.powerPlayOpportunities': 1,
        'linescores.powerPlayOpportunitiesAllowed': 1,
        'linescores.faceOffsTaken': 1,
        'linescores.faceOffWins': 1,
        'linescores.blocked': 1,
        'linescores.takeaways': 1,
        'linescores.giveaways': 1,
        'linescores.hitsFor': 1,
        'linescores.hitsAgainst': 1,
      },
    },
    // Group the linescores into one document
    {
      $group: {
        _id: '$team._id',
        team: { $first: '$team' },
        stats: { $first: '$stats' },
        linescores: { $push: '$linescores' },
      },
    },
    // Perform the final formatting
    {
      $project: {
        _id: { $arrayElemAt: ['$_id', 0] },
        playerId: { $arrayElemAt: ['$team.playerId', 0] },
        teamId: { $arrayElemAt: ['$team.teamId', 0] },
        link: { $arrayElemAt: ['$team.link', 0] },
        siteLink: { $arrayElemAt: ['$team.siteLink', 0] },
        name: { $arrayElemAt: ['$team.name', 0] },
        teamName: { $arrayElemAt: ['$team.teamName', 0] },
        shortName: { $arrayElemAt: ['$team.shortName', 0] },
        abbreviation: { $arrayElemAt: ['$team.abbreviation', 0] },
        locationName: { $arrayElemAt: ['$team.locationName', 0] },
        firstYearOfPlay: { $arrayElemAt: ['$team.firstYearOfPlay', 0] },
        officialSiteUrl: { $arrayElemAt: ['$team.officialSiteUrl', 0] },
        conference: { $arrayElemAt: ['$team.conference', 0] },
        division: { $arrayElemAt: ['$team.division', 0] },
        active: { $arrayElemAt: ['$team.active', 0] },
        twitterHashtag: { $arrayElemAt: ['$team.twitterHashtag', 0] },
        linescores: 1,
        stats: 1,
      },
    },
  ]
}

module.exports = formatTeamStatsPipeline
