if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const axios = require('axios')
const mongoose = require('mongoose')
const config = require('../utils/config')
const Team = require('../models/team')
const Player = require('../models/player')
const { convertFtToCm, convertLbsToKg } = require('./fetch-helpers')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const allTeamsUrl = 'https://statsapi.web.nhl.com/api/v1/teams'
const rosterUrl = teamId =>
  `https://statsapi.web.nhl.com/api/v1/teams/${teamId}/roster`
const playerUrl = playerId =>
  `https://statsapi.web.nhl.com/api/v1/people/${playerId}`

const fetchPlayers = async () => {
  try {
    const teamResponse = await axios.get(allTeamsUrl)

    for (const team of teamResponse.data.teams.slice(0, 1)) {
      const rosterResponse = await axios.get(rosterUrl(team.id))

      const teamToUpdate = await Team.findOne({ teamId: team.id })

      for (const { person } of rosterResponse.data.roster) {
        const playerResponse = await axios.get(playerUrl(person.id))
        const player = playerResponse.data.people[0]

        const boxscoreType =
          player.primaryPosition.code === 'G'
            ? 'GoalieBoxscore'
            : 'SkaterBoxscore'

        const statType =
          player.primaryPosition.code === 'G' ? 'GoalieStats' : 'SkaterStats'

        const newPlayer = new Player({
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
          boxscoreType,
          statType,
          active: player.active,
        })

        await newPlayer.save()
      }
    }
  } catch ({ name, message }) {
    console.log('Error in fetchPlayers')
    console.log(`${name}: ${message}`)
  }
}

fetchPlayers().then(() => mongoose.connection.close())
