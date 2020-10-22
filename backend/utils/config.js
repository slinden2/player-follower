if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

console.log(`Current environment is '${process.env.NODE_ENV}'`)

const JWT_SECRET = process.env.JWT_SECRET

let MONGODB_URI
let RECAPTCHA_SECRET
let MG_CONN_OBJECT
const CURRENT_SEASON = process.env.CURRENT_SEASON

if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = process.env.DEV_MONGODB_URI
  RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_TEST
  MG_CONN_OBJECT = {
    apiKey: process.env.MG_API_KEY,
    domain: process.env.MG_DOMAIN,
    host: 'api.eu.mailgun.net',
  }
}

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
  RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_TEST
  MG_CONN_OBJECT = {
    apiKey: 'NotAvailableInTesting',
    domain: 'NotAvailableInTesting',
    host: 'api.eu.mailgun.net',
  }
}

if (process.env.NODE_ENV === 'production') {
  MONGODB_URI = process.env.PROD_MONGODB_URI
  RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_V2
  MG_CONN_OBJECT = {
    apiKey: process.env.MG_API_KEY,
    domain: process.env.MG_DOMAIN,
    host: 'api.eu.mailgun.net',
  }
}

module.exports = {
  MONGODB_URI,
  JWT_SECRET,
  RECAPTCHA_SECRET,
  MG_CONN_OBJECT,
  CURRENT_SEASON,
}
