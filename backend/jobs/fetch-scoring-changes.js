const mongoose = require('mongoose')
const Twitter = require('twitter')
const config = require('../utils/config')
const ScoringChange = require('../models/scoring-change')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('fetch-player.connected-to-db')
} catch (err) {
  console.error('fetch-player.index.db-connection-error\n', err.stack)
  return
}

const client = new Twitter({
  consumer_key: process.env.TW_CONSUMER_API_KEY,
  consumer_secret: process.env.TW_API_SECRET_KEY,
  access_token_key: process.env.TW_ACCESS_TOKEN,
  access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET,
})

const params = {
  user_id: 1360098198,
  count: 200,
  exclude_replies: true,
  // max_id: 1185908655964725200,
}

client.get(
  'statuses/user_timeline',
  params,
  async (error, tweets, response) => {
    const tweetArray = []
    for (const tweet of tweets) {
      if (tweet.text.toLowerCase().startsWith('official scoring')) {
        const tweetObj = getTweetObject(tweet)
        tweetArray.push(tweetObj)
      }
    }
    console.log(tweetArray)
    mongoose.connection.close()
    process.exit(0)
  }
)

const getTweetObject = tweet => {
  // Create gamePk
  const gameIndex = tweet.text.toLowerCase().indexOf('game ')
  const gameText = tweet.text.slice(gameIndex, gameIndex + 9)
  const numPattern = /\d+/g
  const gameNum = gameText.match(numPattern)[0]
  const gamePk = parseInt(`201902${gameNum.padStart(4, 0)}`)

  // Get link
  const urlIndex = tweet.text.toLowerCase().indexOf('http')
  const link = tweet.text.slice(urlIndex)

  const tweetObj = {
    tweetId: tweet.id,
    createdAt: new Date(tweet.created_at),
    gamePk,
    text: tweet.text.slice(0, urlIndex),
    link,
    userId: tweet.user.id,
    screenName: tweet.user.screen_name,
  }

  return tweetObj
}
