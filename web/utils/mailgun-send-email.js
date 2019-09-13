const mailgun = require('mailgun-js')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mg = mailgun({
  apiKey: process.env.MG_API_KEY,
  domain: process.env.MG_DOMAIN,
  host: 'api.eu.mailgun.net',
})

const data = {
  from: 'Player Fan <norepy@player.fan>',
  to: 'playerfansite@gmail.com',
  subject: 'This is a Mailgun test message',
  text: 'Testing some Mailgun awesomness!',
}

mg.messages().send(data, function(error, body) {
  console.log(body)
})
