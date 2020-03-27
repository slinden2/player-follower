const axios = require('axios')
const querystring = require('querystring')
const config = require('./config')

const validateRecaptcha = async token => {
  const recaptchaQuery = querystring.stringify({
    secret: config.RECAPTCHA_SECRET,
    response: token,
  })

  const res = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    recaptchaQuery
  )

  if (!res.data.success) {
    throw new Error('reCAPTCHA validation failed.')
  }

  return res.data.success
}

module.exports = validateRecaptcha
