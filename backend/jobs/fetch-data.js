if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const axios = require('axios')
const mongoose = require('mongoose')
const Player = require('../models/player')
const config = require('../utils/config')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

// const GAMES_URL = 'https://statsapi.web.nhl.com/api/v1/schedule?date=2019-01-10'
// const boxscoreUrl = (gamePk) => `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/boxscore`
const GAMES_URL = 'http://localhost:3001/games/1'
const BOXSCORE_URL = 'http://localhost:3001/gamePks/1'

const handlePlayer = async (playerData, gamePk) => {
  const { currentTeam, primaryPosition, currentAge, ...info } = playerData.person
  info.currentTeam = playerData.person.currentTeam.id
  info.primaryPosition = playerData.person.primaryPosition.code

  const { stats: { skaterStats } } = playerData
  const { stats: { goalieStats } } = playerData
  if (!skaterStats && !goalieStats) return

  let finalStats = {}
  skaterStats
    ? finalStats = { gamePk, date: Math.floor(new Date().getTime() / 1000), ...skaterStats }
    : finalStats = { gamePk, date: Math.floor(new Date().getTime() / 1000), ...goalieStats }

  const playerInDb = await Player.findOne({ id: info.id })

  if (!playerInDb) {
    const player = new Player({ ...info, stats: { ...finalStats } })
    try {
      await player.save()
    } catch({ name, message }) {
      console.error(`${name}: ${message}`)
    }
  } else {
    playerInDb.stats.push(finalStats)
    try {
      await playerInDb.save()
    } catch({ name, message }) {
      console.error(`${name}: ${message}`)
    }
  }
}

const fetchBoxscore = async (gamePk) => {
  // const { data } = await axios.get(boxscoreUrl(gamePk))
  const { data } = await axios.get(BOXSCORE_URL)
  const { teams: { away } } = data
  const { teams: { home } } = data
  const players = { ...away.players, ...home.players }

  for (const key in players) {
    try {
      await handlePlayer(players[key], gamePk)
    } catch({ name, message }) {
      console.error(`${name}: ${message}`)
    }
  }
}

const fetchGames = async () => {
  const { data: { dates } } = await axios.get(GAMES_URL)
  const { games } = dates[0]
  await fetchBoxscore()
  // games.forEach(game => {
  //   const { gamePk } = game
  //   fetchBoxscore(gamePk)
  // })
}

fetchGames().then(() => mongoose.connection.close())

// ============================
// const TEAMS_URL = 'https://statsapi.web.nhl.com/api/v1/teams'
// const EXPAND_ROSTER = '?expand=team.roster'

// const PLAYERS_URL = 'https://statsapi.web.nhl.com/api/v1/people' 
// const HYDRATE = '?hydrate=stats(splits=statsSingleSeason)'

// const fetchPlayer = async (playerId) => {
//   const { data: { people } } = await axios.get(`${PLAYERS_URL}/${playerId}${HYDRATE}`)
//   const { currentTeam, primaryPosition, currentAge, stats, ...info } = people[0]
//   info.currentTeam = people[0].currentTeam.id
//   info.primaryPosition = people[0].primaryPosition.code
//   const { season, stat } = people[0].stats[0].splits[0]
//   const finalStats = {
//     date: Math.floor(new Date().getTime() / 1000),
//     season,
//     ...stat
//   }
//   const player = new Player({ ...info, stats: { ...finalStats } })
//   await player.save()
// }

// const fetchRoster = async (teamId) => {
//   const { data: { teams } } = await axios.get(`${TEAMS_URL}/${teamId}/${EXPAND_ROSTER}`)
//   const { roster: { roster } } = teams[0]
//   roster.forEach(player => {
//     fetchPlayer(player.person.fullName)
//   })
// }

// const fetchTeams = async () => {
//   const { data: { teams } } = await axios.get(TEAMS_URL)
//   teams.forEach(team => {
//     fetchRoster(team.id)
//   })
// }

// fetchTeams()