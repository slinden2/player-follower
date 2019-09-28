const GoalieBoxscore = require('../../models/goalie-boxscore')
const SkaterBoxscore = require('../../models/skater-boxscore')
const { convertMMSStoSec, isDuplicate } = require('../helpers/fetch-helpers')

const handlePlayer = async (
  playerInDb,
  stats,
  gamePk,
  gameDate,
  homeTeam,
  awayTeam,
  isGoalie
) => {
  if (!isGoalie) {
    stats.points = stats.assists + stats.goals
    stats.evenTimeOnIce = convertMMSStoSec(stats.evenTimeOnIce)
    stats.powerPlayTimeOnIce = convertMMSStoSec(stats.powerPlayTimeOnIce)
    stats.shortHandedTimeOnIce = convertMMSStoSec(stats.shortHandedTimeOnIce)
    stats.faceOffsTaken = stats.faceoffTaken
  } else {
    stats.shotsAgainst = stats.shots
    stats.penaltyMinutes = stats.pim
    stats.savePct = stats.savePercentage
    stats.evenSavePct = stats.evenStrengthSavePercentage
    stats.powerPlaySavePct = stats.powerPlaySavePercentage
    stats.shortHandedSavePct = stats.shortHandedSavePercentage
  }

  stats.timeOnIce = convertMMSStoSec(stats.timeOnIce)
  const boxscore = {
    gamePk,
    gameDate,
    homeTeam: homeTeam._id,
    awayTeam: awayTeam._id,
    player: playerInDb._id,
    ...stats,
  }

  if (!boxscore.penaltyMinutes) boxscore.penaltyMinutes = 0
  if (!boxscore.savePct) boxscore.savePct = 0

  try {
    if (isDuplicate(playerInDb, gamePk)) {
      throw new Error('Duplicate internal game id!')
    }

    let savedBoxscore
    isGoalie
      ? (savedBoxscore = await new GoalieBoxscore(boxscore).save())
      : (savedBoxscore = await new SkaterBoxscore(boxscore).save())

    playerInDb.boxscores = playerInDb.boxscores.concat(savedBoxscore._id)
    await playerInDb.save()
  } catch ({ name, message }) {
    console.error(
      `fetch-boxscores.fetchGames.fetchBoxscore.handlePlayer.saveNewPlayer - playerId: ${playerInDb.playerId}. | gamePk: ${gamePk}`
    )
    console.error(`${name}: ${message}`)
  }
}

module.exports = handlePlayer
