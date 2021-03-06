const calculateSkaterStatsPipeline = require('./calculate-skater-stats-pipeline')
const calculateGoalieStatsPipeline = require('./calculate-goalie-stats-pipeline')
const matchPlayersPipeline = require('./match-players-pipeline')

const playerStatAccumulatorPipeline = (numOfGames, type, filters, seasonId) => {
  // Skaters and goalies have different collections for stats
  const bsFields = {
    skater: ['skaterboxscores', calculateSkaterStatsPipeline],
    goalie: ['goalieboxscores', calculateGoalieStatsPipeline],
  }

  const [dbModel, calculateStatsPipeline] = bsFields[type]

  return [
    {
      $lookup: {
        from: 'teams',
        localField: 'currentTeam',
        foreignField: '_id',
        as: 'team',
      },
    },
    matchPlayersPipeline(filters),
    {
      $lookup: {
        from: dbModel,
        localField: 'boxscores',
        foreignField: '_id',
        as: 'boxscores',
      },
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
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
    {
      $project: {
        firstName: 1,
        lastName: 1,
        boxscores: { $slice: ['$boxscores', -numOfGames] },
      },
    },
    { $unwind: { path: '$boxscores', preserveNullAndEmptyArrays: true } },
    ...calculateStatsPipeline('_id'),
  ]
}

module.exports = playerStatAccumulatorPipeline
