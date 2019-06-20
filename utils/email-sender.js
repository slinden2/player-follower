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
    text: `Please visit the following link to activate your account: http://localhost:3000/confirmation/${token}`,
    html: `Please visit the following link to activate your account: <a href="http://localhost:3000/confirmation/${token}">Link</a>`,
  })

  console.log(`message sent: ${info.messageId}`)
  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
}

module.exports = { sendEmail }
