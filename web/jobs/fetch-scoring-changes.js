/*
This job fetches the published scoring changes directly from
@PR_NHL (NHL Public Relations) twitter account.

They publish scoring changes always in the same format, for example:

OFFICIAL SCORING CHANGE: Game 896
@PredsNHL
 at 
@StLouisBlues

Goal at 10:50 of the second period now reads Alexander Steen from Jordan Kyrou and Tyler Bozak. #NHLStats

This is not so useful for Player Fan, as the scores will be rechecked weekly, but
I still save the scoring changes in the DB just in case.
*/

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
  console.log('fetch-scoring-changes.connected-to-db')
} catch (err) {
  console.error('fetch-scoring-changes.index.db-connection-error\n', err.stack)
  return
}

const client = new Twitter({
  consumer_key: process.env.TW_CONSUMER_API_KEY,
  consumer_secret: process.env.TW_API_SECRET_KEY,
  access_token_key: process.env.TW_ACCESS_TOKEN,
  access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET,
})

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

  // Create object to be saved in DB
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

// Twitter library uses old callback API.
// Convert it to use promises.
const fetchTweets = async params =>
  new Promise((resolve, reject) => {
    client.get(
      'statuses/user_timeline',
      params,
      async (error, tweets, response) => {
        if (error) {
          reject(error)
        }

        const tweetArray = []
        for (const tweet of tweets) {
          // The scoring change tweets all start with "official scoring"
          if (tweet.text.toLowerCase().startsWith('official scoring')) {
            const tweetObj = getTweetObject(tweet)
            tweetArray.push(tweetObj)
          }
        }

        const scoringChanges = await ScoringChange.insertMany(tweetArray, {
          ordered: false,
        })
        resolve(scoringChanges)
      }
    )
  })

const fetchScoringChanges = async () => {
  const mostRecentTweet = await ScoringChange.find({})
    .sort({ tweetId: -1 })
    .limit(1)
  const sinceId = mostRecentTweet[0].tweetId

  const params = {
    user_id: 1360098198,
    count: 200,
    exclude_replies: true,
    since_id: sinceId,
  }

  await fetchTweets(params)
}

fetchScoringChanges()
  .then(() => {
    mongoose.connection.close()
    process.exit(0)
  })
  .catch(err =>
    console.error('fetch-scoring-changes.fetchScoringChanges', err.stack)
  )
