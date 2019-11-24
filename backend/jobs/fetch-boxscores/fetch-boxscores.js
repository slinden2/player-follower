const axios = require('axios')
const ScriptState = require('../../models/script-state')
const Player = require('../../models/player')
require('../../models/skater-boxscore')
require('../../models/goalie-boxscore')
const Team = require('../../models/team')
const getPlayers = require('./get-players')
const createPlayers = require('../create-players')
const handlePlayer = require('./handle-player')

const boxscoreUrl = gamePk =>
  `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/feed/live`

const fetchBoxscores = async gamePks => {
  console.log(`fetch-goals.fetchBoxscores - ${gamePks}`)
  const scriptAlreadyRan = await ScriptState.findOne({})
  if (!scriptAlreadyRan.fetchGames) {
    throw new Error(
      'fetch-boxscores.fetchBoxscores - Games must be fetched first'
    )
  } else if (scriptAlreadyRan.fetchBoxscores) {
    throw new Error(
      `fetch-boxscores.fetchBoxscores - Boxscores have been already fetched for ${gamePks}`
    )
  }

  const contentPromises = gamePks.map(gamePk => axios.get(boxscoreUrl(gamePk)))
  const scoreArray = await Promise.all(contentPromises)

  for (const { data } of scoreArray) {
    const {
      liveData: {
        boxscore: { teams },
      },
    } = data
    const gamePk = data.gamePk
    const gameDate = data.gameData.datetime.dateTime

    let playerIds
    try {
      playerIds = await getPlayers(teams)
      if (playerIds.notInDb.length) {
        await createPlayers(playerIds.notInDb, gamePk)
      }
    } catch (err) {
      console.error(
        `fetch-boxscores.fetchBoxscores.createPlayers - playersIdsToAdd: ${playerIds.notInDb} | gamePk: ${gamePk}\n`,
        err.stack
      )
    }

    const fetchedPlayers = { ...teams.home.players, ...teams.away.players }
    const homeTeam = await Team.findOne({ teamId: teams.home.team.id })
    const awayTeam = await Team.findOne({ teamId: teams.away.team.id })

    let playersInDb
    try {
      playersInDb = await Player.find({
        playerId: { $in: [...playerIds.inDb, ...playerIds.notInDb] },
      }).populate('boxscores', { gamePk: 1 })
    } catch (err) {
      console.error(
        `fetch-boxscores.fetchBoxscores.fetchAllPlayers - gamePk: ${gamePk}\n`,
        err.stack
      )
    }

    for (const player of playersInDb) {
      const { stats } = fetchedPlayers[`ID${player.playerId}`]

      let playerStats
      let isGoalie
      if (stats.skaterStats) {
        playerStats = stats.skaterStats
        isGoalie = false
      } else {
        playerStats = stats.goalieStats
        isGoalie = true
      }

      try {
        await handlePlayer(
          player,
          playerStats,
          gamePk,
          gameDate,
          homeTeam,
          awayTeam,
          isGoalie
        )
      } catch (err) {
        console.error(
          `fetch-boxscores.fetchBoxscores.handlePlayer - gamePk: ${gamePk} | gameDate: ${gameDate} | playerId: ${player.playerId} `
        )
      }
    }
  }
  await ScriptState.updateOne({}, { $set: { fetchBoxscores: true } })
}

module.exports = fetchBoxscores
