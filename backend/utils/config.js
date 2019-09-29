if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

console.log(`Current environment is '${process.env.NODE_ENV}'`)

const JWT_SECRET = process.env.JWT_SECRET

let MONGODB_URI

if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'staging'
) {
  MONGODB_URI = process.env.DEV_MONGODB_URI
}

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

if (process.env.NODE_ENV === 'production') {
  MONGODB_URI = process.env.PROD_MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  JWT_SECRET,
}
