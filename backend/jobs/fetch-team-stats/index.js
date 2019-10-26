const axios = require('axios')
const mongoose = require('mongoose')
const Team = require('../../models/team')
const TeamStats = require('../../models/team-stats')
const ScriptState = require('../../models/script-state')
const config = require('../../utils/config')
const createTeamStats = require('./create-team-stats')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const statUrl =
  'https://api.nhle.com/stats/rest/team?isAggregate=false&reportType=basic&isGame=false&reportName=teamsummary&cayenneExp=leagueId=133%20and%20gameTypeId=2%20and%20seasonId>=20192020%20and%20seasonId<=20192020'

// use this https://statsapi.web.nhl.com/api/v1/teams/5/stats

const fetchTeamStats = async () => {
  console.log(`fetch-team-stats.fetchTeamStats - url: ${statUrl}`)

  const scriptAlreadyRan = await ScriptState.findOne({})
  if (scriptAlreadyRan.fetchTeamStats) {
    throw new Error(
      'fetch-team-stats.fetchTeamStats - Team stats have already been fetched for today.'
    )
  }

  try {
    const teams = await Team.find({})
    const response = await axios.get(statUrl)
    const stats = response.data.data

    for (const teamStats of stats) {
      console.log(
        `fetch-team-stats.fetchTeamStats.teamLoop - team: ${teamStats.teamFullName}`
      )
      try {
        const teamInDb = teams.find(team => team.teamId === teamStats.teamId)

        if (!teamInDb) {
          throw new Error(
            `The team ${teamStats.teamFullName} was not found in db.`
          )
        }

        const newTeamStats = createTeamStats(teamInDb, teamStats)

        const finalTeamStats = new TeamStats(newTeamStats)
        const savedTeamStats = await finalTeamStats.save()

        teamInDb.stats = teamInDb.stats.concat(savedTeamStats._id)
        await teamInDb.save()
      } catch (err) {
        console.error(
          `fetch-team-stats.fetchTeamStats.teamLoop - team: ${teamStats.teamFullName}\n`,
          err.stack
        )
        continue
      }
    }
  } catch (err) {
    console.error('fetch-team-stats.fetchTeamStats\n', err.stack)
  }
}

fetchTeamStats()
  .catch(err => console.error('fetch-team-stats.fetchTeamStats\n', err.stack))
  .then(() => mongoose.connection.close())
