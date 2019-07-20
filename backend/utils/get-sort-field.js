const ENUMS = {
  GP: 'gamesPlayed',
  GOALS: 'goals',
  ASSISTS: 'assists',
  POINTS: 'points',
  PLUSMINUS: 'plusMinus',
  PM: 'penaltyMinutes',
  POINTS_PER_GAME: 'pointsPerGame',
  GWG: 'gameWinningGoals',
  OTG: 'overTimeGoals',
  PPG: 'powerPlayGoals',
  PPP: 'powerPlayPoints',
  SHG: 'shortHandedGoals',
  SHP: 'shortHandedPoints',
  SHOTS: 'shots',
}

const getSortField = sortString => {
  return ENUMS[sortString]
}

module.exports = getSortField
