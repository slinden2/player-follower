const nodemailer = require('nodemailer')

const sendVerificationEmail = async (email, token) => {
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

const sendForgotPasswordEmail = async (email, token) => {
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
    subject: 'Player Follower - Did you forgot your password?',
    text: `Please visit the following link to change your password: http://localhost:3000/forgot-password/${token}`,
    html: `Please visit the following link to change your password: <a href="http://localhost:3000/forgot-password/${token}">Link</a>`,
  })

  console.log(`message sent: ${info.messageId}`)
  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
}

module.exports = { sendVerificationEmail, sendForgotPasswordEmail }
