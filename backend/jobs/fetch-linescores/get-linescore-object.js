const { removeScratches } = require('../fetch-helpers')

const getStat = (boxscore, team, stat) => {
  const skaters = removeScratches(
    boxscore.teams[team].skaters,
    boxscore.teams[team].scratches
  )

  let accumulator = 0
  for (const id of skaters) {
    accumulator +=
      boxscore.teams[team].players[`ID${id}`].stats.skaterStats[stat]
  }

  return accumulator
}

const getLinescoreObject = (
  game,
  awayTeam,
  homeTeam,
  linescore,
  boxscore,
  isHomeGame
) => {
  const homeWins =
    linescore.teams.away.goals < linescore.teams.home.goals ? true : false
  const finalPeriod = linescore.currentPeriod

  const thisTeam = isHomeGame ? 'home' : 'away'
  const otherTeam = isHomeGame ? 'away' : 'home'

  const teamData = {
    team: isHomeGame ? homeTeam._id : awayTeam._id,
    opponentId: isHomeGame ? awayTeam._id : homeTeam._id,
    gamePk: game.gamePk,
    gameDate: game.gameDate,
    isHomeGame,
    points: isHomeGame
      ? homeWins
        ? 2
        : finalPeriod > 3
        ? 1
        : 0
      : !homeWins
      ? 2
      : finalPeriod > 3
      ? 1
      : 0,
    win: isHomeGame ? homeWins : !homeWins,
    otWin: isHomeGame
      ? homeWins && finalPeriod === 4
      : !homeWins && finalPeriod === 4,
    shootOutWin: isHomeGame
      ? homeWins && finalPeriod === 5
      : !homeWins && finalPeriod === 5,
    loss: isHomeGame
      ? !homeWins && finalPeriod <= 3
      : homeWins && finalPeriod <= 3,
    ot: isHomeGame ? !homeWins && finalPeriod > 3 : homeWins && finalPeriod > 3,
    goalsFor: linescore.teams[thisTeam].goals,
    goalsAgainst: linescore.teams[otherTeam].goals,
    penaltyMinutes: boxscore.teams[thisTeam].teamStats.teamSkaterStats.pim,
    shotsFor: boxscore.teams[thisTeam].teamStats.teamSkaterStats.shots,
    shotsAgainst: boxscore.teams[otherTeam].teamStats.teamSkaterStats.shots,
    powerPlayGoals:
      boxscore.teams[thisTeam].teamStats.teamSkaterStats.powerPlayGoals,
    powerPlayGoalsAllowed:
      boxscore.teams[otherTeam].teamStats.teamSkaterStats.powerPlayGoals,
    powerPlayOpportunities:
      boxscore.teams[thisTeam].teamStats.teamSkaterStats.powerPlayOpportunities,
    powerPlayOpportunitiesAllowed:
      boxscore.teams[otherTeam].teamStats.teamSkaterStats
        .powerPlayOpportunities,
    faceOffsTaken: getStat(boxscore, thisTeam, 'faceoffTaken'),
    faceOffWins: getStat(boxscore, thisTeam, 'faceOffWins'),
    blocked: boxscore.teams[thisTeam].teamStats.teamSkaterStats.blocked,
    takeaways: boxscore.teams[thisTeam].teamStats.teamSkaterStats.takeaways,
    giveaways: boxscore.teams[thisTeam].teamStats.teamSkaterStats.giveaways,
    hitsFor: boxscore.teams[thisTeam].teamStats.teamSkaterStats.hits,
    hitsAgainst: boxscore.teams[otherTeam].teamStats.teamSkaterStats.hits,
  }

  return teamData
}

module.exports = getLinescoreObject
