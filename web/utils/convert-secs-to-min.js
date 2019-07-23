const dateFns = require('date-fns')

const convertSecsToMin = secs => {
  const helperDate = dateFns.addSeconds(new Date(0), secs)
  return dateFns.format(helperDate, 'mm:ss')
}

module.exports = convertSecsToMin
