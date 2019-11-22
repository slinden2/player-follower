const axios = require('axios')
const Game = require('../../models/game')
const Goal = require('../../models/goal')
const ScriptState = require('../../models/script-state')
const handleGoal = require('./handle-goal')

const contentUrl = gamePk =>
  `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/feed/live`

const fetchGoals = async gamePks => {
  console.log(`fetch-goals.fetchGoals - ${gamePks}`)
  const scriptAlreadyRan = await ScriptState.findOne({})
  if (!scriptAlreadyRan.fetchGames) {
    throw new Error(
      `fetch-goals.fetchGoals - Games much be fetched first: ${gamePks}`
    )
  } else if (scriptAlreadyRan.fetchGoals) {
    throw new Error(
      `fetch-goals.fetchGoals - Goals have been already fetched for ${gamePks}`
    )
  }

  const contentPromises = gamePks.map(gamePk => axios.get(contentUrl(gamePk)))
  const gameArray = await Promise.all(contentPromises)

  const games = await Game.find(
    { gamePk: { $in: gamePks } },
    { gamePk: 1, apiDate: 1 }
  )

  let goalArray = []
  for (const gameData of gameArray) {
    const {
      data: {
        liveData: {
          plays: { allPlays },
        },
      },
    } = gameData

    const gameInDb = games.find(game => {
      return game.gamePk === gameData.data.gamePk
    })

    const goals = allPlays.filter(({ result }) => result.eventTypeId === 'GOAL')

    let goalObjects = []
    for (const goal of goals) {
      try {
        const newGoal = await handleGoal(
          gameData.data.gamePk,
          gameInDb._id,
          gameInDb.apiDate,
          goal
        )
        goalObjects = [...goalObjects, newGoal]
      } catch (err) {
        console.error(
          `fetch-goals.fetchGoals.handleGoal - ${gamePks}\n`,
          err.stack
        )
      }
    }
    goalArray = [...goalArray, ...goalObjects]

    try {
      await Goal.insertMany(goalArray)
      await ScriptState.updateOne({}, { fetchGoals: true })
    } catch (err) {
      console.error(
        `fetch-goals.fetchGoals - Error while updating db. ${gamePks}\n`,
        err.stack
      )
    }
  }
}

module.exports = fetchGoals
