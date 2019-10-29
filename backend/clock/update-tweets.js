const axios = require('axios')
const Job = require('../models/job')
const Tweet = require('../models/tweet')
const Team = require('../models/team')

const date = new Date().toISOString().split('T')[0]
const gameUrl = date =>
  `https://statsapi.web.nhl.com/api/v1/schedule?date=${date}`

const updateTweets = async () => {
  await Job.deleteMany({})
  await Tweet.deleteMany({})

  const { data } = await axios.get(gameUrl(date))

  let tweetArray = []
  let jobArray = []
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
    const date = game.gameDate.split('T')[0]
    const month = parseInt(date.split('-')[1])
    const day = parseInt(date.split('-')[2])

    const time = game.gameDate.split('T')[1]
    let hours = parseInt(time.split(':')[0]) - 1
    if (hours < 0) hours = 23

    const minutes = parseInt(time.split(':')[1])

    const cronTime = `${minutes} ${hours} ${day} ${month} *`

    jobArray = [
      ...jobArray,
      {
        name: `Tweet #${i}`,
        message: {
          taskName: 'postTweet',
          queue: 'worker-queue',
          dataId: i,
        },
        cronTime,
        repeat: 0,
      },
    ]
  }
  jobArray = [
    ...jobArray,
    {
      name: 'Tweet #X',
      message: {
        taskName: 'postTweet',
        queue: 'worker-queue',
        dataId: 1,
      },
      cronTime: '0 12 * * *',
      repeat: 0,
    },
  ]

  await Tweet.insertMany(tweetArray)
  await Job.insertMany(jobArray)
}

module.exports = updateTweets
