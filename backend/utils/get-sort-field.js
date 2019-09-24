const ENUMS = {
  PLAYER: 'lastName',
  GP: 'gamesPlayed',
  GOALS: 'goals',
  ASSISTS: 'assists',
  POINTS: 'points',
  PLUSMINUS: 'plusMinus',
  PM: 'penaltyMinutes',
  POINTS_PER_GAME: 'pointsPerGame',
  PPG: 'powerPlayGoals',
  PPP: 'powerPlayPoints',
  SHG: 'shortHandedGoals',
  SHP: 'shortHandedPoints',
  SHOTS: 'shots',
  FO_PCT: 'faceOffPct',
  SHOT_PCT: 'shotPct',
  TA: 'takeaways',
  GA: 'giveaways',
  TON_PER_GAME: 'timeOnIcePerGame',
  SHTON_PER_GAME: 'shortHandedTimeOnIcePerGame',
  PPTON_PER_GAME: 'powerPlayTimeOnIcePerGame',
  BLOCKED: 'blocked',
}

const getSortField = sortString => {
  return ENUMS[sortString]
}

module.exports = getSortField
