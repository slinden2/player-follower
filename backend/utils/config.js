if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

console.log(`Current environment is '${process.env.NODE_ENV}'`)

const JWT_SECRET = process.env.JWT_SECRET

let MONGODB_URI
let RECAPTCHA_SECRET

if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = process.env.DEV_MONGODB_URI
  RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_TEST
}

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
  RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_TEST
}

if (process.env.NODE_ENV === 'production') {
  MONGODB_URI = process.env.PROD_MONGODB_URI
  RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_V2
}

module.exports = {
  MONGODB_URI,
  JWT_SECRET,
  RECAPTCHA_SECRET,
}
