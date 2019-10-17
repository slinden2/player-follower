const dateFns = require('date-fns')

const convertSecsToMin = secs => {
  const helperDate = dateFns.addSeconds(new Date(0), secs)
  return dateFns.format(helperDate, 'mm:ss')
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
  }

  return strObj[num]
}

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
  SHOT_PCT: 'shotPct',
  HITS: 'hits',
  FOT: 'faceOffsTaken',
  FO_PCT: 'faceOffPct',
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

const positionDesc = {
  R: 'Right Wing',
  L: 'Left Wing',
  C: 'Center',
  D: 'Defenceman',
}

const positionAbbr = {
  R: 'RW',
  L: 'LW',
  C: 'C',
  D: 'D',
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
