const playerStatAccumulatorPipeline = require('./pipelines/player-stat-accumulator-pipeline')
const teamStatAccumulatorPipeline = require('./pipelines/team-stat-accumulator-pipeline')
const formatPlayerStatsPipeline = require('./pipelines/format-player-stats-pipeline')
const formatTeamStatsPipeline = require('./pipelines/format-team-stats-pipeline')

const profileAggregate = (siteLink, type) => {
  // Must be higher than max amount of games player during season
  const numOfGames = 100

  const accumulatorSelecor = {
    goalie: [playerStatAccumulatorPipeline, formatPlayerStatsPipeline],
    skater: [playerStatAccumulatorPipeline, formatPlayerStatsPipeline],
    team: [teamStatAccumulatorPipeline, formatTeamStatsPipeline],
  }

  const [statAccumulatorPipeline, formatStatsPipeline] = accumulatorSelecor[
    type
  ]

  const pipeline = [
    ...statAccumulatorPipeline(numOfGames, type, { siteLink }),
    ...formatStatsPipeline(type),
  ]

  return pipeline
}

module.exports = profileAggregate
