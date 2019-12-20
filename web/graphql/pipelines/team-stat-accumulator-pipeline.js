const matchTeamsPipeline = require('./match-teams-pipeline')
const calculateTeamStatsPipeline = require('./calculate-team-stats-pipeline')

const teamStatAccumulatorPipeline = (numOfGames, type, filters) => {
  return [
    matchTeamsPipeline(filters),
    {
      $lookup: {
        from: 'conferences',
        localField: 'conference',
        foreignField: '_id',
        as: 'conference',
      },
    },
    {
      $lookup: {
        from: 'divisions',
        localField: 'division',
        foreignField: '_id',
        as: 'division',
      },
    },
    {
      $lookup: {
        from: 'linescores',
        localField: 'linescores',
        foreignField: '_id',
        as: 'linescores',
      },
    },
    {
      $project: {
        linescores: { $slice: ['$linescores', -numOfGames] },
      },
    },
    { $unwind: '$linescores' },
    ...calculateTeamStatsPipeline('_id'),
  ]
}

module.exports = teamStatAccumulatorPipeline
