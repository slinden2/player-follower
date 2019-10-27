const Twitter = require('twitter')
const Tweet = require('../../models/tweet')

const client = new Twitter({
  consumer_key: process.env.TW_CONSUMER_API_KEY,
  consumer_secret: process.env.TW_API_SECRET_KEY,
  access_token_key: process.env.TW_ACCESS_TOKEN,
  access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET,
})

client
  .post('statuses/update', { status: 'I Love Twitter' })
  .then(tweet => console.log(tweet))
  .catch(err => {
    console.log(err)
  })
