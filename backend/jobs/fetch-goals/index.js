const mongoose = require('mongoose')
const axios = require('axios')
const config = require('../../utils/config')
const Goal = require('../../models/goal')
const Game = require('../../models/game')
const Player = require('../../models/player')
const Team = require('../../models/team')
const Milestone = require('../../models/milestone')
const { convertMMSStoSec } = require('../helpers/fetch-helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('fetch-goals.index.connected-to-db')
} catch (exception) {
  console.error('fetch-goals.index.db-connection-error')
  console.error(exception)
  return
}

const gamePk = process.argv[2]

console.log(`fetch-goals.index.fetch-started-${gamePk}`)

fetchGoals(gamePk)
  .catch(({ name, message }) => {
    console.error(`fetch-goals.fetchGoals: ${name}: ${message}`)
  })
  .then(() => mongoose.connection.close())

async function fetchGoals(gamePk) {
  const contentUrl = gamePk =>
    `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/feed/live`

  const url = contentUrl(gamePk)

  const {
    data: {
      liveData: {
        plays: { allPlays },
      },
    },
  } = await axios.get(url)

  const goals = allPlays.filter(({ result }) => result.eventTypeId === 'GOAL')
  const game = await Game.findOne({ gamePk })

  let goalObjects = []
  for (const goal of goals) {
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

    const goalObject = {
      game: game._id,
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

    goalObjects = [...goalObjects, goalObject]
  }

  const res = await Goal.insertMany(goalObjects)
}
