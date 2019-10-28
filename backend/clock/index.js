const mongoose = require('mongoose')
const config = require('../utils/config')
const updateTweets = require('./update-tweets')
const clock = require('./clock')

try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('clock.connected-to-db')
} catch (err) {
  console.error('clock.db-connection-error\n', err.stack)
  return
}

const main = async () => {
  await updateTweets()
  clock()
}

main().then(() => mongoose.connection.close())
