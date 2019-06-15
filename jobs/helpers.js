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
  const result = player.boxscores.filter(obj => obj.gamePk === gamePk)
  return result.length > 0
}

module.exports = {
  convertFtToCm,
  convertLbsToKg,
  isDuplicate,
  convertMMSStoSec,
}
