const axios = require('axios')
const mongoose = require('mongoose')
const Conference = require('../models/conference')
const Division = require('../models/division')
const Team = require('../models/team')
const config = require('../utils/config')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const teamsUrl = 'https://statsapi.web.nhl.com/api/v1/teams'

const fetchTeams = async () => {
  try {
    const response = await axios.get(teamsUrl)

    for (const team of response.data.teams) {
      const teamInDb = await Team.findOne({ teamId: team.id })
      if (teamInDb) continue

      const conference = await Conference.findOne({
        conferenceId: team.conference.id,
      })

      const division = await Division.findOne({
        divisionId: team.division.id,
      })

      const newTeam = new Team({
        teamId: team.id,
        link: team.link,
        name: team.name,
        teamName: team.teamName,
        shortName: team.shortName,
        abbreviation: team.abbreviation,
        locationName: team.locationName,
        firstYearOfPlay: team.firstYearOfPlay,
        officialSiteUrl: team.officialSiteUrl,
        conference: conference._id,
        division: division._id,
        active: team.active,
      })

      const savedTeam = await newTeam.save()
      conference.teams = conference.teams.concat(savedTeam._id)
      division.teams = division.teams.concat(savedTeam._id)
      await conference.save()
      await division.save()
    }
  } catch ({ name, message }) {
    console.log('Error in fetchTeams')
    console.log(`${name}: ${message}`)
  }
}

fetchTeams().then(() => mongoose.connection.close())
