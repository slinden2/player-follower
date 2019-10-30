const axios = require('axios')
const querystring = require('querystring')

const validateRecaptcha = async token => {
  const recaptchaQuery = querystring.stringify({
    secret: process.env.RECAPTCHA_SECRET_V2,
    response: token,
  })

  const res = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    recaptchaQuery
  )

  console.log(res)

  return res.data.success
}

module.exports = validateRecaptcha
