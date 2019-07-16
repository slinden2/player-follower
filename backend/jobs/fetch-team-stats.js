const axios = require('axios')
const mongoose = require('mongoose')
const Team = require('../models/team')
const TeamStats = require('../models/team-stats')
const config = require('../utils/config')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const statUrl =
  'https://api.nhle.com/stats/rest/team?isAggregate=false&reportType=basic&isGame=false&reportName=teamsummary&cayenneExp=leagueId=133%20and%20gameTypeId=2%20and%20seasonId>=20182019%20and%20seasonId<=20182019'

const createTeamStats = (teamInDb, stats) => {
  const teamStats = {
    ...stats,
    faceOffWinPct: stats.faceoffWinPctg,
    ppPct: stats.ppPctg,
    pkPct: stats.pkPctg,
    pointPct: stats.pointPctg,
  }
  teamStats.date = new Date().toISOString().split('T')[0]
  teamStats.team = teamInDb._id
  delete teamStats.abbrev
  delete teamStats.teamFullName
  delete teamStats.teamId

  return teamStats
}

const fetchTeamStats = async () => {
  try {
    const teams = await Team.find({})
    const response = await axios.get(statUrl)
    const stats = response.data.data

    for (const teamStats of stats) {
      const teamInDb = teams.find(team => team.teamId === teamStats.teamId)

      if (!teamInDb) {
        console.log(`The team ${teamStats.teamFullName} was not found in db.`)
        continue
      }

      const newTeamStats = createTeamStats(teamInDb, teamStats)

      const finalTeamStats = new TeamStats(newTeamStats)
      const savedTeamStats = await finalTeamStats.save()

      teamInDb.stats = teamInDb.stats.concat(savedTeamStats._id)
      await teamInDb.save()
    }
  } catch ({ name, message }) {
    console.log('Error in fetchTeamStats')
    console.log(`${name}: ${message}`)
  }
}

fetchTeamStats().then(() => mongoose.connection.close())
