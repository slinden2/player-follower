/* 
This is a job that is supposed to be run once a week. The purpose is to check
if the scores in the NHL API have been updated and update the Player Fan
DB accordingly.

The script run schedule is set with cron tabs server side.
*/

const mongoose = require('mongoose')
const axios = require('axios')
const _ = require('lodash')
const SkaterBoxscore = require('../models/skater-boxscore')
const Game = require('../models/game')
require('../models/player')
const config = require('../utils/config')
const { convertMMSStoSec } = require('./fetch-helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('update-boxscores.connected-to-db')
} catch (err) {
  console.error('update-boxscores.index.db-connection-error\n', err.stack)
  return
}

const getDifferences = (oldScore, newScore) => {
  const diff = []
  for (const stat in newScore) {
    if (typeof newScore[stat] === 'string') {
      newScore[stat] = convertMMSStoSec(newScore[stat])
    }
    if (oldScore[stat] !== newScore[stat]) {
      diff.push({
        key: stat,
        newValue: newScore[stat],
        oldValue: oldScore[stat],
      })
    }
  }
  return diff
}

const updateBoxscores = async () => {
  const eightDaysAgo = new Date(new Date() - 691200000).toISOString()
  const games = await Game.find(
    { gameDate: { $gt: eightDaysAgo } },
    { gamePk: 1 }
  )

  for (const game of games) {
    const boxscoreUrl = gamePk =>
      `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/feed/live`
    const url = boxscoreUrl(game.gamePk)
    const scoresInDb = await SkaterBoxscore.find({
      gamePk: game.gamePk,
    }).populate('player', {
      playerId: 1,
    })
    const {
      data: {
        liveData: {
          boxscore: { teams },
        },
      },
    } = await axios.get(url)
    const playersObject = { ...teams.away.players, ...teams.home.players }

    // Convert player objects into an array
    const playerArray = []
    for (const playerObjId in playersObject) {
      const playerData = playersObject[playerObjId]
      // Exclude goalies and players with empty stats objects to avoid errors
      if (playerData.position.code === 'G' || _.isEmpty(playerData.stats)) {
        continue
      }
      playerArray.push(playerData)
    }

    // Iterate over fetched players and compare new stats to stats in db
    for (const fetchedPlayer of playerArray) {
      const scoreInDb = scoresInDb.find(
        score => score.player.playerId === fetchedPlayer.person.id
      )

      const scoreJSON = scoreInDb.toJSON()

      const {
        gamePk,
        gameDate,
        homeTeam,
        awayTeam,
        player,
        ...skaterStats
      } = fetchedPlayer.stats.skaterStats

      // Sanitize fetched stats so that the fields correspond to db
      skaterStats.faceOffsTaken = skaterStats.faceoffTaken
      delete skaterStats.faceoffTaken
      delete skaterStats.faceOffPct

      // Create object that contains all stat updates for the boxscore
      const differences = getDifferences(
        scoreJSON,
        skaterStats,
        game.gamePk,
        fetchedPlayer.person.id,
        scoreJSON.id
      )

      // If there are differences between stats in db and new stats,
      // update the stats in db.
      if (!_.isEmpty(differences)) {
        let newStats
        differences.forEach(item => {
          const newProp = {
            [item.key]: item.newValue,
          }
          newStats = { ...newStats, ...newProp }
        })

        console.log(game.gamePk)
        console.log(fetchedPlayer.person.id)
        console.log(fetchedPlayer.person.fullName)
        console.log(scoreJSON.id)
        console.log(differences)
        console.log(newStats)
        console.log('')
        await SkaterBoxscore.updateOne(
          { _id: scoreJSON.id },
          { $set: newStats }
        )
      }
    }
  }
}

updateBoxscores()
  .then(() => {
    mongoose.connection.close()
    process.exit(0)
  })
  .catch(err => {
    console.error('update-boxscores.updateBoxcores', err.stack)
    process.exit(1)
  })
