const formatPlayerStatsPipeline = type => {
  const bsField = type === 'skater' ? 'skaterboxscores' : 'goalieboxscores'

  return [
    {
      $project: {
        stats: '$$ROOT',
      },
    },
    {
      $lookup: {
        from: 'players',
        localField: 'stats._id',
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
      $lookup: {
        from: bsField,
        localField: 'player.boxscores',
        foreignField: '_id',
        as: 'boxscores',
      },
    },
    {
      $unwind: '$boxscores',
    },
    {
      $lookup: {
        from: 'teams',
        localField: 'boxscores.homeTeam',
        foreignField: '_id',
        as: 'boxscores.homeTeam',
      },
    },
    {
      $lookup: {
        from: 'teams',
        localField: 'boxscores.awayTeam',
        foreignField: '_id',
        as: 'boxscores.awayTeam',
      },
    },
    {
      $group: {
        _id: '$player._id',
        player: { $first: '$player' },
        team: { $first: '$team' },
        stats: { $first: '$stats' },
        boxscores: { $push: '$boxscores' },
      },
    },
    {
      $project: {
        _id: { $arrayElemAt: ['$_id', 0] },
        playerId: { $arrayElemAt: ['$player.playerId', 0] },
        firstName: { $arrayElemAt: ['$player.firstName', 0] },
        lastName: { $arrayElemAt: ['$player.lastName', 0] },
        primaryNumber: { $arrayElemAt: ['$player.primaryNumber', 0] },
        siteLink: { $arrayElemAt: ['$player.siteLink', 0] },
        birthDate: { $arrayElemAt: ['$player.birthDate', 0] },
        birthCity: { $arrayElemAt: ['$player.birthCity', 0] },
        birthStateProvince: { $arrayElemAt: ['$player.birthStateProvince', 0] },
        birthCountry: { $arrayElemAt: ['$player.birthCountry', 0] },
        nationality: { $arrayElemAt: ['$player.nationality', 0] },
        height: { $arrayElemAt: ['$player.height', 0] },
        weight: { $arrayElemAt: ['$player.weight', 0] },
        alternateCaptain: { $arrayElemAt: ['$player.alternateCaptain', 0] },
        captain: { $arrayElemAt: ['$player.captain', 0] },
        rookie: { $arrayElemAt: ['$player.rookie', 0] },
        shootsCatches: { $arrayElemAt: ['$player.shootsCatches', 0] },
        primaryPosition: { $arrayElemAt: ['$player.primaryPosition', 0] },
        active: { $arrayElemAt: ['$player.active', 0] },
        boxscores: 1,
        stats: 1,
      },
    },
  ]
}

module.exports = formatPlayerStatsPipeline

// timeOnIce: 1,
// assists: 1,
// goals: 1,
// points: 1,
// shots: 1,
// hits: 1,
// powerPlayGoals: 1,
// powerPlayAssists: 1,
// penaltyMinutes: 1,
// faceOffWins: 1,
// takeaways: 1,
// giveaways: 1,
// shortHandedGoals: 1,
// shortHandedAssists: 1,
// blocked: 1,
// plusMinus: 1,
// evenTimeOnIce: 1,
// powerPlayTimeOnIce: 1,
// shortHandedTimeOnIce: 1,
// faceOffsTaken: 1,
// gamesPlayed: 1,
// powerPlayPoints: 1,
// shortHandedPoints: 1,
// faceOffPct: 1,
// timeOnIcePerGame: 1,
// evenTimeOnIcePerGame: 1,
// powerPlayTimeOnIcePerGame: 1,
// shortHandedTimeOnIcePerGame: 1,
// shotsPerGame: 1,
// shotPct: 1,
// pointsPerGame: 1,
// firstName: { $arrayElemAt: ['$player.firstName', 0] },
// lastName: { $arrayElemAt: ['$player.lastName', 0] },
// siteLink: { $arrayElemAt: ['$player.siteLink', 0] },
// position: { $arrayElemAt: ['$player.primaryPosition', 0] },
// team: { $arrayElemAt: ['$team.abbreviation', 0] },
// teamSiteLink: { $arrayElemAt: ['$team.siteLink', 0] },
