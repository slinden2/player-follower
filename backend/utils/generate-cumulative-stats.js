const _ = require('lodash')

const generateCumulativeStats = object => {
  let isAggregate = false
  if (_.has(object, 'player')) isAggregate = true

  const finalObject = (object, isAggregate) => ({
    id: isAggregate ? object.player._id : object.id,
    firstName: isAggregate ? object.player.firstName : object.firstName,
    lastName: isAggregate ? object.player.lastName : object.lastName,
    siteLink: isAggregate ? object.player.siteLink : object.siteLink,
    team: isAggregate ? object.player.currentTeam.abbreviation : null,
    position: isAggregate
      ? object.player.primaryPosition
      : object.primaryPosition,
    gamesPlayed: isAggregate ? object.gamesPlayed : object.stats.gamesPlayed,
    goals: isAggregate ? object.goals : object.stats.goals,
    assists: isAggregate ? object.assists : object.stats.assists,
    points: isAggregate ? object.points : null,
    plusMinus: isAggregate ? object.plusMinus : object.stats.plusMinus,
    penaltyMinutes: isAggregate
      ? object.penaltyMinutes
      : object.stats.penaltyMinutes,
    pointsPerGame: isAggregate
      ? object.pointsPerGame
      : (object.stats.assists + object.stats.goals) / object.stats.gamesPlayed,
    gameWinningGoals: isAggregate
      ? object.gameWinningGoals
      : object.stats.gameWinningGoals,
    overTimeGoals: isAggregate
      ? object.overTimeGoals
      : object.stats.overTimeGoals,
    powerPlayGoals: isAggregate
      ? object.powerPlayGoals
      : object.stats.powerPlayGoals,
    powerPlayPoints: isAggregate
      ? object.powerPlayPoints
      : object.stats.powerPlayAssists,
    shortHandedGoals: isAggregate
      ? object.shortHandedGoals
      : object.stats.shortHandedGoals,
    shortHandedPoints: isAggregate
      ? object.shortHandedPoints
      : object.stats.shortHandedAssists,
    shots: isAggregate ? object.shots : object.stats.shots,
  })

  return finalObject(object, isAggregate)
}

module.exports = generateCumulativeStats
