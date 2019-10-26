const convertFtToCm = height => {
  let [ft, inches] = height.split(' ')
  ft = ft.substring(0, ft.length - 1)
  inches = inches.substring(0, inches.length - 1)
  return Math.round(ft * 30.48 + inches * 2.54)
}

const convertLbsToKg = weight => {
  return Math.round(weight * 0.45359237)
}

const convertMMSStoSec = time => {
  const [mins, secs] = time.split(':')
  return parseInt(mins * 60) + parseInt(secs)
}

const isDuplicate = (player, gamePk) => {
  if (player.boxscores.some(boxscore => boxscore.gamePk === gamePk)) return true
  return false
}

const generateSiteLink = (firstName, lastName) => {
  const fullName = firstName + ' ' + lastName
  return fullName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s/, '-')
    .replace(/\s/, '-')
    .toLowerCase()
}

const generateTeamSiteLink = name => {
  return name
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s/, '-')
    .replace(/\s/, '-')
    .toLowerCase()
}

const isValidDate = date => {
  if (!/^20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/.test(date)) {
    throw new Error('Invalid date argument')
  }
}

const createPlayerObject = (player, team, boxscoreType) => {
  return {
    playerId: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    primaryNumber: player.primaryNumber,
    link: player.link,
    siteLink: generateTeamSiteLink(player.fullName),
    birthDate: player.birthDate,
    birthCity: player.birthCity,
    birthStateProvince: player.birthStateProvince,
    birthCountry: player.birthCountry,
    nationality: player.nationality,
    height: convertFtToCm(player.height),
    weight: convertLbsToKg(player.weight),
    alternateCaptain: player.alternateCaptain || false,
    captain: player.captain || false,
    rookie: player.rookie,
    shootsCatches: player.shootsCatches,
    rosterStatus: player.rosterStatus,
    currentTeam: team._id,
    primaryPosition: player.primaryPosition.code,
    active: player.active,
    boxscoreType,
  }
}

module.exports = {
  convertFtToCm,
  convertLbsToKg,
  isDuplicate,
  convertMMSStoSec,
  generateSiteLink,
  generateTeamSiteLink,
  isValidDate,
  createPlayerObject,
}
