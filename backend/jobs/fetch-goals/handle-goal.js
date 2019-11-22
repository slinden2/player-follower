const { convertMMSStoSec } = require('../fetch-helpers')
const Player = require('../../models/player')
const Team = require('../../models/team')
const Milestone = require('../../models/milestone')

const handleGoal = async (gamePk, gameId, apiDate, goal) => {
  const scorerPlayerId = goal.players.find(
    player => player.playerType === 'Scorer'
  ).player.id

  const goalieData = goal.players.find(player => player.playerType === 'Goalie')
  let goaliePlayerId

  if (goalieData) {
    goaliePlayerId = goalieData.player.id
  }

  const assistData = goal.players.filter(
    player => player.playerType === 'Assist'
  )
  let assist1PlayerId
  let assist2PlayerId

  if (assistData.length) {
    assist1PlayerId = assistData[0].player.id
  }

  if (assistData.length === 2) {
    assist2PlayerId = assistData[1].player.id
  }

  const scorer = await Player.findOne({ playerId: scorerPlayerId }, { _id: 1 })
  const goalie = await Player.findOne({ playerId: goaliePlayerId }, { _id: 1 })
  const assist1 = await Player.findOne(
    { playerId: assist1PlayerId },
    { _id: 1 }
  )
  const assist2 = await Player.findOne(
    { playerId: assist2PlayerId },
    { _id: 1 }
  )
  const team = await Team.findOne({ teamId: goal.team.id })
  const periodTime = convertMMSStoSec(goal.about.periodTime)

  const milestone = await Milestone.findOne({
    gamePk,
    eventId: goal.about.eventId,
  })

  const goalObj = {
    game: gameId,
    scorer: scorer._id,
    assist1: assist1 && assist1._id,
    assist2: assist2 && assist2._id,
    goalie: goalie && goalie._id,
    team: team._id,
    milestone: milestone && milestone._id,
    gamePk,
    apiDate,
    type: goal.result.eventTypeId,
    strength: goal.result.strength.code,
    gameWinningGoal: goal.result.gameWinningGoal,
    emptyNet: goal.result.emptyNet,
    eventIdx: goal.about.eventIdx,
    eventId: goal.about.eventId,
    periodType: goal.about.periodType,
    periodNumber: goal.about.period,
    periodTime,
    dateTime: goal.about.dateTime,
    coordinates: {
      x: goal.coordinates.x,
      y: goal.coordinates.y,
    },
  }

  if (assist1) {
    goalObj.assist1 = assist1._id
  }

  if (assist2) {
    goalObj.assist2 = assist2._id
  }

  if (goalie) {
    goalObj.goalie = goalie._id
  }

  return goalObj
}

module.exports = handleGoal
