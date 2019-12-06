const dateFns = require('date-fns')

const convertSecsToMin = secs => {
  const secLimit = 5999 // 99min 59sec
  const format = secs >= secLimit ? 'hh:mm:ss' : 'mm:ss'

  const helperDate = dateFns.addSeconds(new Date(0), secs)
  return dateFns.format(helperDate, format)
}

const roundToDecimal = num => {
  return (Math.round(num * 100) / 100).toFixed(2)
}

const periodNumberToString = num => {
  const strObj = {
    1: '1st',
    2: '2nd',
    3: '3rd',
    4: 'OT',
    5: 'SO',
  }

  return strObj[num]
}

const ENUMS = {
  ASSISTS: 'assists',
  BLOCKED: 'blocked',
  EVEN_SAVES: 'evenSaves',
  FO_PCT: 'faceOffPct',
  FOT: 'faceOffsTaken',
  GA: 'giveaways',
  GAA: 'goalsAgainstAverage',
  GOALS: 'goals',
  GOALS_AGAINST: 'goalsAgainst',
  GP: 'gamesPlayed',
  HITS: 'hits',
  LOSSES: 'losses',
  PLAYER: 'lastName',
  PLUSMINUS: 'plusMinus',
  PM: 'penaltyMinutes',
  POINTS: 'points',
  POINTS_PER_GAME: 'pointsPerGame',
  PP_SAVE_PCT: 'powerPlaySavePct',
  PP_SAVES: 'powerPlaySaves',
  PP_SHOTS_AGAINST: 'powerPlayShotsAgains',
  PPG: 'powerPlayGoals',
  PPP: 'powerPlayPoints',
  SH_SAVE_PCT: 'shortHandedSavePct',
  PPTON_PER_GAME: 'powerPlayTimeOnIcePerGame',
  SA: 'shotsAgainst',
  SA_PER_GAME: 'shotsAgainstPerGame',
  SAVE_PCT: 'savePct',
  SAVES: 'saves',
  SAVES_PER_GAME: 'savesPerGame',
  SH_SAVES: 'shortHandedSaves',
  SH_SHOTS_AGAINST: 'shortHandedShotsAgains',
  SHG: 'shortHandedGoals',
  SHOT_PCT: 'shotPct',
  SHOTS: 'shots',
  SHUTOUTS: 'shutouts',
  SHP: 'shortHandedPoints',
  SHTON_PER_GAME: 'shortHandedTimeOnIcePerGame',
  TA: 'takeaways',
  TON_PER_GAME: 'timeOnIcePerGame',
  WIN_PCT: 'winPct',
  WINS: 'wins',
}

const getSortField = sortString => {
  return ENUMS[sortString]
}

const positionDesc = {
  R: 'Right Wing',
  L: 'Left Wing',
  C: 'Center',
  D: 'Defenceman',
  G: 'Goalie',
}

const positionAbbr = {
  R: 'RW',
  L: 'LW',
  C: 'C',
  D: 'D',
  G: 'G',
}

const getPositionData = code => {
  return { abbr: positionAbbr[code], desc: positionDesc[code] }
}

module.exports = {
  convertSecsToMin,
  roundToDecimal,
  getSortField,
  getPositionData,
  periodNumberToString,
}
