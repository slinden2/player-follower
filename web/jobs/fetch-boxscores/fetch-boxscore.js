const axios = require('axios')
const Player = require('../../models/player')
const Team = require('../../models/team')
const createPlayers = require('./create-players')
const handlePlayer = require('./handle-player')

const boxscoreUrl = gamePk =>
  `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/boxscore`

const removeScratches = (skaters, scratches) => {
  return skaters.filter(playerId => !scratches.includes(playerId))
}

const fetchBoxscore = async (gamePk, gameDate) => {
  const {
    data: { teams },
  } = await axios.get(boxscoreUrl(gamePk))

  const skatersHome = removeScratches(teams.home.skaters, teams.home.scratches)
  const skatersAway = removeScratches(teams.away.skaters, teams.away.scratches)
  const goaliesHome = removeScratches(teams.home.goalies, teams.home.scratches)
  const goaliesAway = removeScratches(teams.away.goalies, teams.away.scratches)

  const playerIds = [
    ...skatersHome,
    ...skatersAway,
    ...goaliesHome,
    ...goaliesAway,
  ]

  const playersInDb = await Player.find({
    playerId: { $in: playerIds },
  }).populate('boxscores', { gamePk: 1 })

  const playerIdsInDb = playersInDb.map(player => player.playerId)
  const playerIdsNotInDb = playerIds.filter(
    playerId => !playerIdsInDb.includes(playerId)
  )

  await createPlayers(teams, playerIdsNotInDb, gamePk)

  // In production this should be unneccesary. The players will be fetched and saved before boxscores
  // so when fetching boxscores all players should be found.
  console.log(
    `gamePk: ${gamePk} | gameDate: ${gameDate} | playerIds not found in db: ${playerIdsNotInDb}`
  )

  const fetchedPlayers = { ...teams.home.players, ...teams.away.players }

  const homeTeam = await Team.findOne({ teamId: teams.home.team.id })
  const awayTeam = await Team.findOne({ teamId: teams.away.team.id })

  for (const player of playersInDb) {
    const { stats } = fetchedPlayers[`ID${player.playerId}`]

    let playerStats
    let isGoalie
    if (stats.skaterStats) {
      playerStats = stats.skaterStats
      isGoalie = false
    } else {
      playerStats = stats.goalieStats
      isGoalie = true
    }

    await handlePlayer(
      player,
      playerStats,
      gamePk,
      gameDate,
      homeTeam,
      awayTeam,
      isGoalie
    )
  }
}

module.exports = fetchBoxscore
