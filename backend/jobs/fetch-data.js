if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const axios = require('axios')
const mongoose = require('mongoose')
const Player = require('../models/player')
const config = require('../utils/config')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const TEAMS_URL = 'https://statsapi.web.nhl.com/api/v1/teams'
const EXPAND_ROSTER = '?expand=team.roster'

const PLAYERS_URL = 'https://statsapi.web.nhl.com/api/v1/people' 
const HYDRATE = '?hydrate=stats(splits=statsSingleSeason)'

const fetchPlayer = async (playerId) => {
  const { data: { people } } = await axios.get(`${PLAYERS_URL}/${playerId}${HYDRATE}`)
  const { currentTeam, primaryPosition, currentAge, stats, ...info } = people[0]
  info.currentTeam = people[0].currentTeam.id
  info.primaryPosition = people[0].primaryPosition.code
  const { season, stat } = people[0].stats[0].splits[0]
  const finalStats = {
    date: Math.floor(new Date().getTime() / 1000),
    season,
    ...stat
  }
  const player = new Player({ ...info, stats: { ...finalStats } })
  await player.save()
}

const fetchRoster = async (teamId) => {
  const { data: { teams } } = await axios.get(`${TEAMS_URL}/${teamId}/${EXPAND_ROSTER}`)
  const { roster: { roster } } = teams[0]
  roster.forEach(player => {
    fetchPlayer(player.person.fullName)
  })
}

const fetchTeams = async () => {
  const { data: { teams } } = await axios.get(TEAMS_URL)
  teams.forEach(team => {
    fetchRoster(team.id)
  })
}

fetchTeams()

mongoose.connection.close()