/*
This job needs to be run daily. Creates and saves tweets in the DB
so that they can be published before the games start.
*/

const mongoose = require('mongoose')
const axios = require('axios')
const Tweet = require('../models/tweet')
const Team = require('../models/team')
const config = require('../utils/config')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

try {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('create-tweets.connected-to-db')
} catch (err) {
  console.error('create-tweets.db-connection-error\n', err.stack)
  process.exit(1)
}

const date = new Date().toISOString().split('T')[0]
const contentUrl = date =>
  `https://statsapi.web.nhl.com/api/v1/schedule?date=${date}`

const createTweets = async () => {
  const { data } = await axios.get(contentUrl(date))

  let tweetArray = []
  for (const [i, game] of data.dates[0].games.entries()) {
    const awayTeam = await Team.findOne(
      { teamId: game.teams.away.team.id },
      { _id: 1 }
    )
    const homeTeam = await Team.findOne(
      { teamId: game.teams.home.team.id },
      { _id: 1 }
    )

    tweetArray = [
      ...tweetArray,
      {
        dataId: i,
        gameDate: game.gameDate,
        awayTeam: awayTeam._id,
        homeTeam: homeTeam._id,
      },
    ]
  }

  await Tweet.insertMany(tweetArray)
}

createTweets()
  .then(() => mongoose.connection.close())
  .catch(err => console.error('create-tweets.createTweets ', err.stack))

module.exports = createTweets
