const axios = require('axios')
const mongoose = require('mongoose')
const config = require('../utils/config')
const Team = require('../models/team')
const Player = require('../models/player')
const {
  convertFtToCm,
  convertLbsToKg,
  generateSiteLink,
} = require('./helpers/fetch-helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const allTeamsUrl = 'https://statsapi.web.nhl.com/api/v1/teams'
const rosterUrl = teamId =>
  `https://statsapi.web.nhl.com/api/v1/teams/${teamId}/roster`
const playerUrl = playerId =>
  `https://statsapi.web.nhl.com/api/v1/people/${playerId}`

const createPlayerProps = (player, team) => {
  return {
    playerId: player.id,
    link: player.link,
    siteLink: generateSiteLink(player.firstName, player.lastName),
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
    currentTeam: team._id,
    primaryPosition: player.primaryPosition.code,
    active: player.active,
  }
}

const updateTeam = async (previousTeamId, newTeamId, playerDocId) => {
  const prevTeamInDb = await Team.findOne({ _id: previousTeamId })
  const newTeamInDb = await Team.findOne({ _id: newTeamId })

  prevTeamInDb.players = prevTeamInDb.players.filter(
    id => id.toString() !== playerDocId.toString()
  )
  newTeamInDb.players = newTeamInDb.players.concat(playerDocId)

  await prevTeamInDb.save()
  await newTeamInDb.save()
}

const updatePlayer = async (playerInDb, currentTeam, fetchedPlayer) => {
  console.log(`updating player ${playerInDb.playerId}`)

  if (playerInDb.currentTeam._id.toString() !== currentTeam._id.toString()) {
    console.log(`updating the team of ${playerInDb.playerId}`)
    console.log(
      `previous team: ${playerInDb.currentTeam._id} | new team: ${currentTeam._id}`
    )
    updateTeam(playerInDb.currentTeam._id, currentTeam._id, playerInDb._id)
  }

  const newProps = createPlayerProps(fetchedPlayer, currentTeam)
  await playerInDb.updateOne({ ...newProps })

  console.log('player updated')
}

const fetchPlayers = async () => {
  let currentTeam
  let player
  try {
    const teamResponse = await axios.get(allTeamsUrl)

    for (const team of teamResponse.data.teams) {
      const rosterResponse = await axios.get(rosterUrl(team.id))

      currentTeam = await Team.findOne({ teamId: team.id })

      for (const { person } of rosterResponse.data.roster) {
        const playerResponse = await axios.get(playerUrl(person.id))
        player = playerResponse.data.people[0]

        const playerInDb = await Player.findOne({ playerId: player.id })
        if (playerInDb) {
          console.log(`${playerInDb.playerId} already in db`)
          await updatePlayer(playerInDb, currentTeam, player)
          continue
        }

        const boxscoreType =
          player.primaryPosition.code === 'G'
            ? 'GoalieBoxscore'
            : 'SkaterBoxscore'

        const statType =
          player.primaryPosition.code === 'G' ? 'GoalieStats' : 'SkaterStats'

        const newPlayer = new Player(createPlayerProps(player, currentTeam))
        newPlayer.boxscoreType = boxscoreType
        newPlayer.statType = statType

        const savedPlayer = await newPlayer.save()
        currentTeam.players = currentTeam.players.concat(savedPlayer._id)
        await currentTeam.save()
      }
    }
  } catch ({ name, message }) {
    console.log('Error in fetchPlayers')
    console.log(`Fetched playerId: ${player.playerId}`)
    console.log(`Fetched teamId: ${currentTeam.teamId}`)
    console.log(`${name}: ${message}`)
  }
}

fetchPlayers().then(() => mongoose.connection.close())
