const mailgun = require('mailgun-js')

let domain = 'http://www.player.fan'
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  domain = 'http://localhost:3000'
}

const MG_CONN = mailgun({
  apiKey: process.env.MG_API_KEY,
  domain: process.env.MG_DOMAIN,
  // host: 'api.eu.mailgun.net',
})

const sendVerificationEmail = (email, token) => {
  const data = {
    from: 'Player Fan <norepy@player.fan>',
    to: 'playerfansite@gmail.com',
    subject: 'Account confirmation',
    text: `Please visit the following to to activate your account: ${domain}/confirmation/${token}`,
  }

  MG_CONN.messages().send(data, (error, body) => {
    console.log(body)
  })
}

const sendForgotPasswordEmail = async (email, token) => {
  const data = {
    from: 'Player Fan <norepy@player.fan>',
    to: 'playerfansite@gmail.com',
    subject: 'Change your password with this mail',
    text: `Please visit the following link to change your password: ${domain}/forgot-password/${token}`,
  }

  MG_CONN.messages().send(data, function(error, body) {
    console.log(body)
  })
}

module.exports = { sendVerificationEmail, sendForgotPasswordEmail }
