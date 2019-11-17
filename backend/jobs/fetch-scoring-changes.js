const Twitter = require('twitter')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
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
  max_id: 1185908655964725200,
}

// client.get('statuses/user_timeline', params, function(error, tweets, response) {
//   if (!error) {
//     console.log(tweets.length)
//   }
// })

client.get('statuses/user_timeline', params, (error, tweets, response) => {
  tweets.forEach(tweet => {
    // console.log(tweet)
    if (tweet.text.startsWith('OFFICIAL SCORING')) {
      console.log(tweet.id, tweet.created_at, tweet.text)
    }
  })
})
