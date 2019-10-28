const Twitter = require('twitter')

const client = new Twitter({
  consumer_key: process.env.TW_CONSUMER_API_KEY,
  consumer_secret: process.env.TW_API_SECRET_KEY,
  access_token_key: process.env.TW_ACCESS_TOKEN,
  access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET,
})

const getTweetStr = data => {
  return `
#${data.away.team}@#${data.home.team} starting soon!

Hottest players based on the last 3 games:
${data.away.hashtag}
#${data.away.player1.lastName} | ${data.away.player1.goals} + ${data.away.player1.assists} = ${data.away.player1.points}
#${data.away.player2.lastName} | ${data.away.player2.goals} + ${data.away.player2.assists} = ${data.away.player2.points}

${data.home.hashtag}
#${data.home.player1.lastName} | ${data.home.player1.goals} + ${data.home.player1.assists} = ${data.home.player1.points}
#${data.home.player2.lastName} | ${data.home.player2.goals} + ${data.home.player2.assists} = ${data.home.player2.points}

#pftop2 https://www.player.fan
  `
}

const postTweet = async data => {
  const tweetString = getTweetStr(data)
  try {
    const response = await client.post('statuses/update', {
      status: tweetString,
    })
    return response
  } catch (err) {
    console.error('Error while sending the tweet\n', err.stack)
  }
}

module.exports = postTweet
