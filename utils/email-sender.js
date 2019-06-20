const nodemailer = require('nodemailer')

const sendEmail = async (email, token) => {
  console.log(email)
  const testAccount = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })

  const info = await transporter.sendMail({
    from: '"Player Follower " <no-reply@test.com>',
    to: email,
    subject: 'Account Confirmation Email',
    text: `Please click the token to activate your account: http://localhost:4000/graphql?query={verify${token}`,
    html: `Please click the token to activate your account: http://localhost:4000/graphql?${token}`,
  })

  console.log(`message sent: ${info.messageId}`)
  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
}

module.exports = { sendEmail }
