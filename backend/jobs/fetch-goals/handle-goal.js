const { convertMMSStoSec } = require('../fetch-helpers')
const Player = require('../../models/player')
const Team = require('../../models/team')
const Milestone = require('../../models/milestone')

const handleGoal = async (gamePk, gameId, goal) => {
  const playerId = goal.players.find(player => player.playerType === 'Scorer')
    .player.id
  const player = await Player.findOne({ playerId })
  const team = await Team.findOne({ teamId: goal.team.id })
  const periodTime = convertMMSStoSec(goal.about.periodTime)
  const milestone = await Milestone.findOne({
    playerId,
    gamePk,
    type: 'GOAL',
    periodTime: { $lte: periodTime + 5, $gte: periodTime - 5 },
    periodNumber: goal.about.period,
  })
  return {
    game: gameId,
    player: player._id,
    team: team._id,
    milestone: milestone && milestone._id,
    gamePk,
    type: goal.result.eventTypeId,
    strength: goal.result.strength.code,
    gameWinningGoal: goal.result.gameWinningGoal,
    emptyNet: goal.result.emptyNet,
    periodType: goal.about.periodType,
    periodNumber: goal.about.period,
    periodTime,
    dateTime: goal.about.dateTime,
    coordinates: {
      x: goal.coordinates.x,
      y: goal.coordinates.y,
    },
  }
}

module.exports = handleGoal
