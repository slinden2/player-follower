const mongoose = require('mongoose')

const milestonePipeline = (playerId, gamePks) => [
  {
    $match: {
      scorer: mongoose.Types.ObjectId(playerId),
      gamePk: { $in: gamePks },
    },
  },
  {
    $lookup: {
      from: 'players',
      foreignField: '_id',
      localField: 'scorer',
      as: 'scorer',
    },
  },
  {
    $lookup: {
      from: 'players',
      foreignField: '_id',
      localField: 'assist1',
      as: 'assist1',
    },
  },
  {
    $lookup: {
      from: 'players',
      foreignField: '_id',
      localField: 'assist2',
      as: 'assist2',
    },
  },
  {
    $lookup: {
      from: 'players',
      foreignField: '_id',
      localField: 'goalie',
      as: 'goalie',
    },
  },
  {
    $lookup: {
      from: 'milestones',
      foreignField: '_id',
      localField: 'milestone',
      as: 'milestone',
    },
  },
  {
    $unwind: '$milestone',
  },
  {
    $lookup: {
      from: 'teams',
      foreignField: '_id',
      localField: 'milestone.team',
      as: 'milestone.team',
    },
  },
  {
    $lookup: {
      from: 'teams',
      foreignField: '_id',
      localField: 'milestone.opponent',
      as: 'milestone.opponent',
    },
  },
  {
    $unwind: '$milestone.highlight.playbacks',
  },
  {
    $match: {
      'milestone.highlight.playbacks.name': { $regex: /^flash_1800/i },
    },
  },
  {
    $project: {
      gamePk: 1,
      gameWinningGoal: 1,
      emptyNet: 1,
      strength: 1,
      shotType: 1,
      gameDate: '$milestone.gameDate',
      periodTime: '$milestone.periodTime',
      periodNumber: '$milestone.periodNumber',
      playback: '$milestone.highlight.playbacks',
      tempScorer: {
        lastName: { $arrayElemAt: ['$scorer.lastName', 0] },
        siteLink: { $arrayElemAt: ['$scorer.siteLink', 0] },
      },
      tempAssist1: {
        lastName: { $arrayElemAt: ['$assist1.lastName', 0] },
        siteLink: { $arrayElemAt: ['$assist1.siteLink', 0] },
      },
      tempAssist2: {
        lastName: { $arrayElemAt: ['$assist2.lastName', 0] },
        siteLink: { $arrayElemAt: ['$assist2.siteLink', 0] },
      },
      tempGoalie: {
        lastName: { $arrayElemAt: ['$goalie.lastName', 0] },
        siteLink: { $arrayElemAt: ['$goalie.siteLink', 0] },
      },
      team: {
        abbreviation: {
          $arrayElemAt: ['$milestone.team.abbreviation', 0],
        },
        siteLink: {
          $arrayElemAt: ['$milestone.team.siteLink', 0],
        },
      },
      opponent: {
        abbreviation: {
          $arrayElemAt: ['$milestone.opponent.abbreviation', 0],
        },
        siteLink: {
          $arrayElemAt: ['$milestone.opponent.siteLink', 0],
        },
      },
    },
  },
  {
    $addFields: {
      scorer: '$tempScorer',
      assist1: '$tempAssist1',
      assist2: '$tempAssist2',
      goalie: '$tempGoalie',
    },
  },
  {
    $project: {
      tempScorer: 0,
      tempAssist1: 0,
      tempAssist2: 0,
      tempGoalie: 0,
    },
  },
]

module.exports = milestonePipeline
