const matchTeamsPipeline = require('./match-teams-pipeline')
const calculateTeamStatsPipeline = require('./calculate-team-stats-pipeline')

const teamStatAccumulatorPipeline = (numOfGames, _type, filters, seasonId) => {
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
        linescores: {
          $filter: {
            input: '$linescores',
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
        linescores: { $slice: ['$linescores', -numOfGames] },
      },
    },
    { $unwind: { path: '$linescores', preserveNullAndEmptyArrays: true } },
    ...calculateTeamStatsPipeline('_id'),
  ]
}

module.exports = teamStatAccumulatorPipeline
