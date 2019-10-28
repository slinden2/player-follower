const GoalieBoxscore = require('../../models/goalie-boxscore')
const SkaterBoxscore = require('../../models/skater-boxscore')
const { convertMMSStoSec, isDuplicate } = require('../fetch-helpers')

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
    // Sometimes from API shots are 0 even if player has scored.
    // This causes zero division error in the best players aggregation pipeline.
    if (stats.goals && !stats.shots) stats.shots = 1
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
  } catch (err) {
    console.error(
      `fetch-boxscores.fetchBoxscores.handlePlayer.saveNewBoxscore - playerId: ${playerInDb.playerId} | gamePk: ${gamePk}\n`,
      err.stack
    )
  }
}

module.exports = handlePlayer
