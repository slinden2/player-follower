const axios = require('axios')
const mongoose = require('mongoose')
const config = require('../utils/config')
const Team = require('../models/team')
const Player = require('../models/player')
const { convertFtToCm, convertLbsToKg } = require('./fetch-helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const allTeamsUrl = 'https://statsapi.web.nhl.com/api/v1/teams'
const rosterUrl = teamId =>
  `https://statsapi.web.nhl.com/api/v1/teams/${teamId}/roster`
const playerUrl = playerId =>
  `https://statsapi.web.nhl.com/api/v1/people/${playerId}`

const createPlayerProps = player => {
  return {
    playerId: player.id,
    link: player.link,
    firstName: player.firstName,
    lastName: player.lastName,
    primaryNumber: player.primaryNumber,
    birthDate: player.birthDate,
    birthCity: player.birthCity,
    birthStateProvince: player.birthStateProvince,
    birthCountry: player.birthCountry,
    nationality: player.nationality,
    height: convertFtToCm(player.height),
    weight: convertLbsToKg(player.weight),
    alternateCaptain: player.alternateCaptain,
    captain: player.captain,
    rookie: player.rookie,
    shootsCatches: player.shootsCatches,
    rosterStatus: player.rosterStatus,
    currentTeam: player.currentTeam.id,
    primaryPosition: player.primaryPosition.code,
    active: player.active,
  }
}

const updateTeam = async (previousTeamId, newTeamId, playerDocId) => {
  const prevTeamInDb = await Team.findOne({ teamId: previousTeamId })
  const newTeamInDb = await Team.findOne({ teamId: newTeamId })

  prevTeamInDb.players = prevTeamInDb.players.filter(
    id => id.toString() !== playerDocId.toString()
  )
  newTeamInDb.players = newTeamInDb.players.concat(playerDocId)

  await prevTeamInDb.save()
  await newTeamInDb.save()
}

const updatePlayer = async (playerInDb, fetchedPlayer) => {
  console.log(`updating player ${playerInDb.playerId}`)
  const newProps = createPlayerProps(fetchedPlayer)
  await playerInDb.updateOne({ ...newProps })

  if (playerInDb.currentTeam !== fetchedPlayer.currentTeam.id) {
    console.log(`updating the team of ${playerInDb.playerId}`)
    console.log(
      `previous team: ${playerInDb.currentTeam} | new team: ${
        fetchedPlayer.currentTeam.id
      }`
    )
    updateTeam(
      playerInDb.currentTeam,
      fetchedPlayer.currentTeam.id,
      playerInDb._id
    )
  }
}

const fetchPlayers = async () => {
  let teamToUpdate
  let player
  try {
    const teamResponse = await axios.get(allTeamsUrl)

    for (const team of teamResponse.data.teams) {
      const rosterResponse = await axios.get(rosterUrl(team.id))

      teamToUpdate = await Team.findOne({ teamId: team.id })

      for (const { person } of rosterResponse.data.roster) {
        const playerResponse = await axios.get(playerUrl(person.id))
        player = playerResponse.data.people[0]

        const playerInDb = await Player.findOne({ playerId: player.id })
        if (playerInDb) {
          console.log(`${playerInDb.playerId} already in db`)
          await updatePlayer(playerInDb, player)
          continue
        }

        const boxscoreType =
          player.primaryPosition.code === 'G'
            ? 'GoalieBoxscore'
            : 'SkaterBoxscore'

        const statType =
          player.primaryPosition.code === 'G' ? 'GoalieStats' : 'SkaterStats'

        const newPlayer = new Player(createPlayerProps(player))
        newPlayer.boxscoreType = boxscoreType
        newPlayer.statType = statType

        const savedPlayer = await newPlayer.save()
        teamToUpdate.players = teamToUpdate.players.concat(savedPlayer._id)
        await teamToUpdate.save()
      }
    }
  } catch ({ name, message }) {
    console.log('Error in fetchPlayers')
    console.log(`Fetched playerId: ${player.id}`)
    console.log(`Fetched teamId: ${teamToUpdate.teamId}`)
    console.log(`${name}: ${message}`)
  }
}

fetchPlayers().then(() => mongoose.connection.close())
