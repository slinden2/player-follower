const bestPlayersPipeline = require('./pipelines/best-players-pipeline')
const reformatPlayerCardData = require('./pipelines/reformat-player-card-data')

const playerCardSort = sortBy => {
  const sortArg =
    sortBy === 'points'
      ? { [`stats.${sortBy}`]: -1 }
      : { [`stats.${sortBy}`]: -1, 'stats.points': -1 }

  return [
    {
      $sort: {
        ...sortArg,
        'stats.goals': -1,
        'stats.plusMinus': -1,
        'player.lastName': 1,
      },
    },
    { $limit: 50 },
  ]
}

const playerCardSortGoalie = sortBy => {
  const sortArg =
    sortBy === 'wins'
      ? { [`stats.${sortBy}`]: -1 }
      : { [`stats.${sortBy}`]: -1, 'stats.wins': -1 }

  return [
    {
      $sort: {
        ...sortArg,
        'stats.savePct': -1,
        'stats.goalsAgainstAverage': 1,
        'player.lastName': 1,
      },
    },
    { $limit: 20 },
  ]
}

const bestPlayersAggregate = (
  numOfGames,
  positionFilter,
  teamFilter,
  nationalityFilter,
  sortBy
) => {
  const getSortStage =
    positionFilter === 'GOALIE' ? playerCardSortGoalie : playerCardSort

  const pipeline = [
    ...bestPlayersPipeline(
      numOfGames,
      positionFilter,
      teamFilter,
      nationalityFilter
    ),
    ...reformatPlayerCardData(numOfGames),
    ...getSortStage(sortBy),
  ]

  return pipeline
}

module.exports = bestPlayersAggregate
