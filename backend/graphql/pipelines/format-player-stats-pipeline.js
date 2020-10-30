const skaterBoxscoreFields = {
  player: 1,
  team: 1,
  stats: 1,
  'boxscores._id': 1,
  'boxscores.gamePk': 1,
  'boxscores.gameDate': 1,
  'boxscores.homeTeam': { $arrayElemAt: ['$boxscores.homeTeam', 0] },
  'boxscores.awayTeam': { $arrayElemAt: ['$boxscores.awayTeam', 0] },
  'boxscores.timeOnIce': 1,
  'boxscores.assists': 1,
  'boxscores.goals': 1,
  'boxscores.shots': 1,
  'boxscores.hits': 1,
  'boxscores.powerPlayGoals': 1,
  'boxscores.powerPlayAssists': 1,
  'boxscores.penaltyMinutes': 1,
  'boxscores.faceOffWins': 1,
  'boxscores.takeaways': 1,
  'boxscores.giveaways': 1,
  'boxscores.shortHandedGoals': 1,
  'boxscores.shortHandedAssists': 1,
  'boxscores.blocked': 1,
  'boxscores.plusMinus': 1,
  'boxscores.evenTimeOnIce': 1,
  'boxscores.powerPlayTimeOnIce': 1,
  'boxscores.shortHandedTimeOnIce': 1,
  'boxscores.points': 1,
  'boxscores.faceOffsTaken': 1,
}

const goalieBoxscoreFields = {
  player: 1,
  team: 1,
  stats: 1,
  'boxscores._id': 1,
  'boxscores.gamePk': 1,
  'boxscores.gameDate': 1,
  'boxscores.homeTeam': { $arrayElemAt: ['$boxscores.homeTeam', 0] },
  'boxscores.awayTeam': { $arrayElemAt: ['$boxscores.awayTeam', 0] },
  'boxscores.timeOnIce': 1,
  'boxscores.assists': 1,
  'boxscores.goals': 1,
  'boxscores.saves': 1,
  'boxscores.powerPlaySaves': 1,
  'boxscores.shortHandedSaves': 1,
  'boxscores.evenSaves': 1,
  'boxscores.shortHandedShotsAgainst': 1,
  'boxscores.powerPlayShotsAgainst': 1,
  'boxscores.decision': 1,
  'boxscores.shotsAgainst': 1,
  'boxscores.penaltyMinutes': 1,
  'boxscores.savePct': 1,
  'boxscores.evenSavePct': 1,
  'boxscores.powerPlaySavePct': 1,
}

const formatPlayerStatsPipeline = (type, seasonId) => {
  const bsField = type === 'skater' ? 'skaterboxscores' : 'goalieboxscores'

  return [
    // Create embedded document for stats
    {
      $project: {
        stats: '$$ROOT',
      },
    },
    // Get player
    {
      $lookup: {
        from: 'players',
        localField: 'stats._id',
        foreignField: '_id',
        as: 'player',
      },
    },
    // Get players team
    {
      $lookup: {
        from: 'teams',
        localField: 'player.currentTeam',
        foreignField: '_id',
        as: 'team',
      },
    },
    // Populate each individual boxscore
    {
      $lookup: {
        from: bsField,
        localField: 'player.boxscores',
        foreignField: '_id',
        as: 'boxscores',
      },
    },
    {
      $addFields: {
        boxscores: {
          $filter: {
            input: '$boxscores',
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
    // Unwind by boxscores so that we can populate homeTeam and awayTeam fields
    {
      $unwind: { path: '$boxscores', preserveNullAndEmptyArrays: true },
    },
    // Get home team
    {
      $lookup: {
        from: 'teams',
        localField: 'boxscores.homeTeam',
        foreignField: '_id',
        as: 'boxscores.homeTeam',
      },
    },
    // Get away team
    {
      $lookup: {
        from: 'teams',
        localField: 'boxscores.awayTeam',
        foreignField: '_id',
        as: 'boxscores.awayTeam',
      },
    },
    // Take team documents out of arrays
    {
      $project: type === 'skater' ? skaterBoxscoreFields : goalieBoxscoreFields,
    },
    // Group boxscores into one document
    {
      $group: {
        _id: '$player._id',
        player: { $first: '$player' },
        team: { $first: '$team' },
        stats: { $first: '$stats' },
        boxscores: { $push: '$boxscores' },
      },
    },
    // Perform final formatting
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
        currentTeam: { $arrayElemAt: ['$team', 0] },
        boxscores: 1,
        stats: 1,
      },
    },
  ]
}

module.exports = formatPlayerStatsPipeline
