const _ = require('lodash')
const Milestone = require('../../../models/milestone')
const createVideoData = require('./create-video-data')
const { convertMMSStoSec } = require('../../helpers/fetch-helpers')

const createMilestones = async (data, game, awayTeam, homeTeam) => {
  const milestones = data.milestones.items.filter(
    item =>
      (item.type === 'SHOT' || item.type === 'GOAL') &&
      !_.isEmpty(item.highlight)
  )

  let milestoneArray = []
  for (const milestone of milestones) {
    const opponentId =
      parseInt(milestone.teamId) === awayTeam.teamId
        ? homeTeam.teamId
        : awayTeam.teamId

    const newMilestone = {
      gamePk: game.gamePk,
      gameDate: game.gameDate,
      teamId: parseInt(milestone.teamId),
      opponentId,
      playerId: parseInt(milestone.playerId),
      type: milestone.type,
      periodTime: convertMMSStoSec(milestone.periodTime),
      periodNumber: parseInt(milestone.period),
      votes: {
        downVotes: 0,
        upVotes: 0,
      },
      comments: [],
      highlight: createVideoData(milestone.highlight),
    }
    milestoneArray = [...milestoneArray, newMilestone]
  }

  const savedMilestones = await Milestone.insertMany(milestoneArray)
  return savedMilestones
}

module.exports = createMilestones
