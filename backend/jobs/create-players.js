const axios = require('axios')
const Team = require('../models/team')
const Player = require('../models/player')
const { createPlayerObject } = require('./fetch-helpers')

const contentUrl = playerId =>
  `https://statsapi.web.nhl.com/api/v1/people/${playerId}`

const createPlayers = async (newPlayers, gamePk) => {
  console.log(
    `create-players.createPlayers - playersToAdd: ${newPlayers} | gamePk: ${gamePk}`
  )

  let playerArray = []
  for (const id of newPlayers) {
    const { data } = await axios.get(contentUrl(id))
    if (data) {
      playerArray = [...playerArray, data.people[0]]
    }
  }

  for (const player of playerArray) {
    const teamInDb = await Team.findOne(
      { teamId: player.currentTeam.id },
      { _id: 1, players: 1 }
    )
    try {
      const boxscoreType =
        player.primaryPosition.code === 'G'
          ? 'GoalieBoxscore'
          : 'SkaterBoxscore'

      const playerObj = createPlayerObject(player, teamInDb, boxscoreType)

      const savedPlayer = await new Player(playerObj).save()
      teamInDb.players = [...teamInDb.players, savedPlayer._id]
      await teamInDb.save()
    } catch (err) {
      console.error(
        `create-players.createPlayers.playerLoop - playerId: ${player.id} | ${gamePk}\n`,
        err.stack
      )
      continue
    }
  }
}

module.exports = createPlayers
