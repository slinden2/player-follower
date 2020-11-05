const _ = require('lodash')
const Player = require('../../models/player')
const createPlayers = require('../create-players')
const Milestone = require('../../models/milestone')
const createVideoData = require('./create-video-data')
const { convertMMSStoSec } = require('../fetch-helpers')

const createMilestones = async (data, game, awayTeam, homeTeam, apiDate) => {
  const rawMilestones = data.milestones.items.filter(
    item =>
      (item.type === 'SHOT' || item.type === 'GOAL') &&
      !_.isEmpty(item.highlight)
  )

  // Sometimes there are duplicate milestones. This removes duplicates.
  const milestones = _.uniqBy(rawMilestones, 'highlight.id')

  let milestoneArray = []
  for (const milestone of milestones) {
    const team =
      homeTeam.teamId === parseInt(milestone.teamId)
        ? homeTeam._id
        : awayTeam._id
    const opponent =
      homeTeam.teamId === parseInt(milestone.teamId)
        ? awayTeam._id
        : homeTeam._id

    if (milestone.playerId) {
      const playerId = parseInt(milestone.playerId)

      let player = await Player.findOne({ playerId }, { _id: 1 })
      if (!player) {
        await createPlayers([playerId], game.gamePk)
        player = await Player.findOne({ playerId }, { _id: 1 })
        // I know, why don't I return the _id from createPlayers?
        // createPlayers doesn't return anything at the moment
        // and I don't want to change it as I know that it works flawlessly.
        // There is no need to optimize here.
      }

      const newMilestone = {
        gamePk: game.gamePk,
        gameDate: game.gameDate,
        apiDate,
        team,
        opponent,
        player: player._id,
        eventId: parseInt(milestone.statsEventId),
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
  }

  const savedMilestones = await Milestone.insertMany(milestoneArray)
  return savedMilestones
}

module.exports = createMilestones
