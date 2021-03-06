/* 
This is the script that actually posts tweets in Twitter.

The tweets in DB is id'd so that this script can recognize
the tweet to be published. Obviously the ID is needed as argument
when running this script.

The run schedule is defined by crontab on server side.
*/

const mongoose = require('mongoose')
const config = require('../../utils/config')
const getTweetData = require('./get-tweet-data')
const postTweet = require('./post-tweet')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('post-tweet.connected-to-db')
} catch (err) {
  console.error('post-tweet.db-connection-error\n', err.stack)
  return
}

const dataId = process.argv[2]

const runPostTweet = async () => {
  try {
    const data = await getTweetData(dataId)
    const response = await postTweet(data)
    console.log(
      `post-tweet.getPostTweet - Tweet created at ${response.created_at}`
    )
  } catch (err) {
    console.error('post-tweet.getTweetData/postTweet\n', err.stack)
  }
}

runPostTweet()
  .catch(err => console.error('post-tweet.runPostTweet\n', err.stack))
  .then(() => mongoose.connection.close())
