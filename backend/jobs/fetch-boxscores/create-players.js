const Team = require('../../models/team')
const Player = require('../../models/player')
const {
  generateTeamSiteLink,
  convertFtToCm,
  convertLbsToKg,
  createPlayerObject,
} = require('../fetch-helpers')

const createPlayers = async (data, newPlayers, gamePk) => {
  console.log(
    `fetch-game-data.fetchGames.fetchBoxscore.createPlayers - playersToAdd: ${newPlayers} | gamePk: ${gamePk}`
  )

  const dataPerTeam = [data.away, data.home]

  for (const team of dataPerTeam) {
    const teamInDb = await Team.findOne({ teamId: team.team.id })

    const playerArray = []
    for (const id of newPlayers) {
      const newData = team.players[`ID${id}`]
      if (newData) playerArray.push(newData)
    }

    let finalPlayerArray = []

    for (const player of playerArray) {
      try {
        const boxscoreType =
          player.person.primaryPosition.code === 'G'
            ? 'GoalieBoxscore'
            : 'SkaterBoxscore'

        finalPlayerArray = [
          ...finalPlayerArray,
          createPlayerObject(player.person, teamInDb, boxscoreType),
        ]
      } catch (err) {
        console.error(
          `fetch-boxscores.fetchBoxscores.createPlayers.playerLoop - playerId: ${player.person.id} | ${gamePk}\n`,
          err.stack
        )
        continue
      }
    }

    // try {
    //   const insertedPlayers = await Player.insertMany(finalPlayerArray, {
    //     ordered: true,
    //   })
    //   teamInDb.players = [
    //     ...teamInDb.players,
    //     ...insertedPlayers.map(player => player._id),
    //   ]
    //   await teamInDb.save()
    // } catch (err) {
    //   console.error(
    //     `fetch-boxscores.fetchBoxscores.createPlayers.updateDb - playersToAdd: ${newPlayers}`,
    //     err.stack
    //   )
    // }
  }
}

module.exports = createPlayers
