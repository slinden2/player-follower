const mailgun = require('mailgun-js')
const { MG_CONN_OBJECT } = require('./config')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mg = mailgun(MG_CONN_OBJECT)

const data = {
  from: 'Player Fan <norepy@player.fan>',
  to: 'playerfansite@gmail.com',
  subject: 'This is a Mailgun test message',
  text: 'Testing some Mailgun awesomness!',
}

mg.messages().send(data, function (error, body) {
  console.log(body)
})
