const Player = require('../../models/player')

const removeScratches = (skaters, scratches) => {
  return skaters.filter(playerId => !scratches.includes(playerId))
}

const getPlayers = async teams => {
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

  let playersInDb = await Player.find(
    {
      playerId: { $in: playerIds },
    },
    { playerId: 1, _id: 0 }
  )

  const playerIdsInDb = playersInDb.map(player => player.playerId)
  const playerIdsNotInDb = playerIds.filter(
    playerId => !playerIdsInDb.includes(playerId)
  )

  return { inDb: playerIdsInDb, notInDb: playerIdsNotInDb }
}

module.exports = getPlayers
