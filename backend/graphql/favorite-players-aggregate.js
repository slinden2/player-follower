const bestPlayersPipeline = require('./pipelines/best-players-pipeline')
const reformatPlayerCardData = require('./pipelines/reformat-player-card-data')
const playerCardSort = require('./pipelines/player-card-sort')

const favoritePlayersAggregate = (
  playerList,
  numOfGames,
  positionFilter,
  teamFilter,
  nationalityFilter,
  sortBy,
  seasonId
) => {
  const pipeline = [
    {
      $match: {
        _id: { $in: playerList },
      },
    },
    ...bestPlayersPipeline({
      numOfGames,
      positionFilter,
      teamFilter,
      nationalityFilter,
      seasonId,
    }),
    ...reformatPlayerCardData(numOfGames),
    ...playerCardSort(sortBy),
  ]

  return pipeline
}

module.exports = favoritePlayersAggregate
