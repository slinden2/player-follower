const axios = require('axios')
const mongoose = require('mongoose')
const Twitter = require('twitter')
const _ = require('lodash')
const Conference = require('../models/conference')
const Division = require('../models/division')
const Team = require('../models/team')
const Player = require('../models/player')
const SkaterBoxscore = require('../models/skater-boxscore')
const GoalieBoxscore = require('../models/goalie-boxscore')
const TeamStats = require('../models/team-stats')
const Linescore = require('../models/linescore')
const ScriptState = require('../models/script-state')
const ScoringChange = require('../models/scoring-change')
const User = require('../models/user')
const Game = require('../models/game')
const Goal = require('../models/goal')
const Milestone = require('../models/milestone')
const config = require('../utils/config')

/* eslint-disable no-unused-vars */

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const deleteLeague = async () => {
  await Conference.deleteMany({})
  await Division.deleteMany({})
  await Team.deleteMany({})
  await Player.deleteMany({})
  await SkaterBoxscore.deleteMany({})
  await GoalieBoxscore.deleteMany({})
  await TeamStats.deleteMany({})

  await User.updateMany({}, { $set: { favoritePlayers: [] } })
}

const deletePlayers = async () => {
  await Player.deleteMany({})
  await SkaterBoxscore.deleteMany({})
  await GoalieBoxscore.deleteMany({})
  await Team.updateMany({}, { $set: { players: [] } })
  await User.updateMany({}, { $set: { favoritePlayers: [] } })
}

const deletePlayerBoxscores = async () => {
  await SkaterBoxscore.deleteMany({})
  await Player.updateMany({}, { $set: { boxscores: [] } })
}

const deleteGoalieBoxscores = async () => {
  await GoalieBoxscore.deleteMany({})
  const players = await Player.find({ boxscoreType: 'GoalieBoxsore' })
  for (const player of players) {
    player.boxscores = []
    await player.save()
  }
}

const deleteTeamStats = async () => {
  await TeamStats.deleteMany({})
  const teams = await Team.find({})
  for (const team of teams) {
    team.stats = []
    await team.save()
  }
}

const addPlayerBoxscore = async () => {
  const boxscore = new SkaterBoxscore({
    player: '5d287460c19785048cb047e9',
    assists: 2,
    goals: 1,
  })

  const savedBoxscore = await boxscore.save()

  const skater = await Player.findOne({ _id: '5d287460c19785048cb047e9' })
  skater.boxscores = skater.boxscores.concat(savedBoxscore._id)
  const savedSkater = await skater.save()
  console.log(savedSkater)
}

const addGoalieBoxscore = async () => {
  const boxscore = new GoalieBoxscore({
    player: '5d287460c19785048cb047eb',
    saves: 30,
    shotsAgainst: 31,
  })

  const savedBoxscore = await boxscore.save()

  const goalie = await Player.findOne({ _id: '5d287460c19785048cb047eb' })
  goalie.boxscores = goalie.boxscores.concat(savedBoxscore._id)
  const savedGoalie = await goalie.save()
  console.log(savedGoalie)
}

const populatePlayerBoxscores = async () => {
  const player = await Player.findOne({
    _id: '5d287460c19785048cb047e9',
  }).populate('boxscores')
  console.log(player)
}

const populatePlayer = async () => {
  const boxscore = await SkaterBoxscore.findOne({
    _id: '5d2874f7cbfe1a2a50e6a738',
  }).populate('player')
  console.log(boxscore)
}

const generatePlayerLinks = async () => {
  const players = await Player.find({})

  for (const player of players) {
    await player.updateOne({
      $set: {
        siteLink: `${player.firstName} ${player.lastName}`
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s/, '-')
          .toLowerCase(),
      },
    })
  }
}

const generateTeamLinks = async () => {
  const teams = await Team.find({})

  for (const team of teams) {
    await team.updateOne({
      siteLink: team.name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s/, '-')
        .replace(/\s/, '-')
        .toLowerCase(),
    })
  }
}

const deleteAllStarGames = async () => {
  const boxscores = await GoalieBoxscore.deleteMany({
    gamePk: { $gte: 2018029999 },
  })
}

const addTeamsToBoxscores = async () => {
  const gamePks = await GoalieBoxscore.find().distinct('gamePk')
  for (const gamePk of gamePks) {
    const response = await axios.get(
      `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/boxscore`
    )
    const homeTeam = await Team.findOne({
      teamId: response.data.teams.home.team.id,
    })

    const awayTeam = await Team.findOne({
      teamId: response.data.teams.away.team.id,
    })

    await GoalieBoxscore.updateMany(
      { gamePk },
      { homeTeam: homeTeam._id, awayTeam: awayTeam._id }
    )

    console.log(gamePk)
  }
}

const addNationalities = async () => {
  const players = await Player.find({})
  for (const player of players) {
    if (!player.nationality) {
      player.nationality = player.birthCountry
      await player.save()
    }
  }
}

const addPointsToBoxscores = async () => {
  await SkaterBoxscore.updateMany(
    {},
    { $set: { points: { $add: ['$assists', '$goals'] } } }
  )
}

const addLinescoreArrays = async () => {
  // await Team.updateMany({}, { $set: { linescores: [] } })
  // await Game.updateMany(
  //   {},
  //   { $unset: { awayTeamLinescore: '', homeTeamLinescore: '' } }
  // )
}

const deleteLinescores = async () => {
  await Game.updateMany(
    {},
    { $unset: { awayLinescore: '', homeLinescore: '' } }
  )
  await Team.updateMany({}, { $unset: { linescores: '' } })
  await Linescore.deleteMany({})
}

const getDate = async () => {
  const record = await SkaterBoxscore.find({}, { _id: 1 })
    .sort({ $natural: -1 })
    .limit(1)
  console.log(record[0]._id.getTimestamp().toISOString())
}

const updatePlayerTeam = async () => {
  const contentUrl = playerId =>
    `https://statsapi.web.nhl.com/api/v1/people/${playerId}`

  const players = await Player.find(
    {},
    { playerId: 1, currentTeam: 1 }
  ).populate('currentTeam', { teamId: 1 })

  for (const player of players) {
    // There is an error here. The old team players get completely deleted.
    const {
      data: { people },
    } = await axios.get(contentUrl(player.playerId))
    const newTeamId = people[0].currentTeam.id
    if (player.currentTeam.teamId !== newTeamId) {
      const oldTeam = await Team.findOne({ teamId: player.currentTeam.teamId })
      oldTeam.players = oldTeam.players.filter(id => id === player._id)
      const newTeam = await Team.findOne({ teamId: newTeamId })
      newTeam.players = [...newTeam.players, player._id]
      player.currentTeam = newTeam._id
      const test = await Promise.all([
        oldTeam.save(),
        newTeam.save(),
        player.save(),
      ])
      console.log(test)
    }
  }
}

const fetchTweets = async () => {
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

  const tweets = await client.get('statuses/user_timeline', params)
  const filteredTweets = tweets.filter(tweet =>
    tweet.text.startsWith('OFFICIAL')
  )
  for (const tweet of filteredTweets) {
    console.log(tweet.text)
  }
}

const verifyBoxscores = async () => {
  const scoringChanges = await ScoringChange.find({ isVerified: false })

  for (const scoringChange of scoringChanges) {
    const boxscoreUrl = gamePk =>
      `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/feed/live`
    const url = boxscoreUrl(scoringChange.gamePk)
    const scoresInDb = await SkaterBoxscore.find({
      gamePk: scoringChange.gamePk,
    }).populate('player', {
      playerId: 1,
    })
    const {
      data: {
        liveData: {
          boxscore: { teams },
        },
      },
    } = await axios.get(url)
    const playersObject = { ...teams.away.players, ...teams.home.players }

    // Convert player objects into an array
    const playerArray = []
    for (const playerObjId in playersObject) {
      const playerData = playersObject[playerObjId]
      // Exclude goalies and players with empty stats objects to avoid errors
      if (playerData.position.code === 'G' || _.isEmpty(playerData.stats)) {
        continue
      }
      playerArray.push(playerData)
    }

    for (const fetchedPlayer of playerArray) {
      const scoreInDb = scoresInDb.find(
        score => score.player.playerId === fetchedPlayer.person.id
      )

      // Compare scores between newly fetched boxscore and
      // the corresponding one in the DB
      if (
        fetchedPlayer.stats.skaterStats.assists !== scoreInDb.assists ||
        fetchedPlayer.stats.skaterStats.goals !== scoreInDb.goals ||
        fetchedPlayer.stats.skaterStats.penaltyMinutes !==
          scoreInDb.penaltyMinutes ||
        fetchedPlayer.stats.skaterStats.shots !== scoreInDb.shots ||
        fetchedPlayer.stats.skaterStats.faceOffWins !== scoreInDb.faceOffWins ||
        fetchedPlayer.stats.skaterStats.faceoffTaken !==
          scoreInDb.faceOffsTaken ||
        fetchedPlayer.stats.skaterStats.takeaways !== scoreInDb.takeaways ||
        fetchedPlayer.stats.skaterStats.giveaways !== scoreInDb.giveaways ||
        fetchedPlayer.stats.skaterStats.shortHandedGoals !==
          scoreInDb.shortHandedGoals ||
        fetchedPlayer.stats.skaterStats.shortHandedAssists !==
          scoreInDb.shortHandedAssists ||
        fetchedPlayer.stats.skaterStats.powerPlayGoals !==
          scoreInDb.powerPlayGoals ||
        fetchedPlayer.stats.skaterStats.powerPlayAssists !==
          scoreInDb.powerPlayAssists ||
        fetchedPlayer.stats.skaterStats.blocked !== scoreInDb.blocked ||
        fetchedPlayer.stats.skaterStats.plusMinus !== scoreInDb.plusMinus ||
        fetchedPlayer.stats.skaterStats.hits !== scoreInDb.hits
      ) {
        console.log('gamePk', scoringChange.gamePk)
        console.log('fetchedPlayer.id', fetchedPlayer.person.id)
        console.log('fetchedPlayer.fullName', fetchedPlayer.person.fullName)
        console.log(
          'goals',
          fetchedPlayer.stats.skaterStats.goals !== scoreInDb.goals
        )
        console.log(
          'assists',
          fetchedPlayer.stats.skaterStats.assists !== scoreInDb.assists
        )
        console.log(
          'penaltyMinutes',
          fetchedPlayer.stats.skaterStats.penaltyMinutes !==
            scoreInDb.penaltyMinutes
        )
        console.log(
          'shots',
          fetchedPlayer.stats.skaterStats.shots !== scoreInDb.shots
        )
        console.log(
          'faceOffWins',
          fetchedPlayer.stats.skaterStats.faceOffWins !== scoreInDb.faceOffWins
        )
        console.log(
          'faceOffsTaken',
          fetchedPlayer.stats.skaterStats.faceoffTaken !==
            scoreInDb.faceOffsTaken
        )
        console.log(
          'takeaways',
          fetchedPlayer.stats.skaterStats.takeaways !== scoreInDb.takeaways
        )
        console.log(
          'giveaways',
          fetchedPlayer.stats.skaterStats.giveaways !== scoreInDb.giveaways
        )
        console.log(
          'shortHandedGoals',
          fetchedPlayer.stats.skaterStats.shortHandedGoals !==
            scoreInDb.shortHandedGoals
        )
        console.log(
          'shortHandedAssists',
          fetchedPlayer.stats.skaterStats.shortHandedAssists !==
            scoreInDb.shortHandedAssists
        )
        console.log(
          'powerPlayGoals',
          fetchedPlayer.stats.skaterStats.powerPlayGoals !==
            scoreInDb.powerPlayGoals
        )
        console.log(
          'powerPlayAssists',
          fetchedPlayer.stats.skaterStats.powerPlayAssists !==
            scoreInDb.powerPlayAssists
        )
        console.log(
          'blocked',
          fetchedPlayer.stats.skaterStats.blocked !== scoreInDb.blocked
        )
        console.log(
          'plusMinus',
          fetchedPlayer.stats.skaterStats.plusMinus !== scoreInDb.plusMinus
        )
        console.log(
          'hits',
          fetchedPlayer.stats.skaterStats.hits !== scoreInDb.hits
        )
        console.log('')
        // console.log(
        //   'fetchedPlayer.person.fullName',
        //   fetchedPlayer.person.fullName
        // )
        // console.log('fetchedPlayer.person.id', fetchedPlayer.person.id)
        // console.log(
        //   'fetchedPlayer.goals',
        //   fetchedPlayer.stats.skaterStats.goals
        // )
        // console.log('scoreInDb.goals', scoreInDb.goals)
        // console.log(
        //   'fetchedPlayer.assists',
        //   fetchedPlayer.stats.skaterStats.assists
        // )
        // console.log('scoreInDb.assists', scoreInDb.assists)
      }
    }
  }
}

const deleteLatestGames = async () => {
  const gamePk = 2019020285 // gamePk greater than this will be deleted

  await Game.deleteMany({ gamePk: { $gt: gamePk } })
  await Milestone.deleteMany({ gamePk: { $gt: gamePk } })
  await Goal.deleteMany({ gamePk: { $gt: gamePk } })

  const boxscores = await SkaterBoxscore.find(
    { gamePk: { $gt: gamePk } },
    { _id: 1 }
  )
  const bsIds = boxscores.map(bs => bs._id)

  const goalieBoxscores = await GoalieBoxscore.find(
    { gamePk: { $gt: gamePk } },
    { _id: 1 }
  )
  const gBsIds = goalieBoxscores.map(bs => bs._id)

  // const linescores = await Linescore.find(
  //   { gamePk: { $gt: gamePk } },
  //   { _id: 1 }
  // )
  // const lsIds = linescores.map(ls => ls._id)

  await Player.updateMany({}, { boxscore: { $in: [...bsIds, ...gBsIds] } })
  await SkaterBoxscore.deleteMany({ gamePk: { $gt: gamePk } })
  await GoalieBoxscore.deleteMany({ gamePk: { $gt: gamePk } })
  // await Team.updateMany({})
  // await Linescore.deleteMany({ gamePk: { $gt: gamePk } })
  await ScriptState.updateOne(
    {},
    {
      $set: {
        fetchGames: false,
        fetchGoals: false,
        fetchBoxscores: false,
        fetchTeamStats: false,
        fetchLinescores: false,
      },
    }
  )
}

// deleteLeague().then(() => mongoose.connection.close())
// deletePlayers().then(() => mongoose.connection.close())
// deletePlayerBoxscores().then(() => mongoose.connection.close())
// deleteGoalieBoxscores().then(() => mongoose.connection.close())
// deleteTeamStats().then(() => mongoose.connection.close())
// addPlayerBoxscore().then(() => mongoose.connection.close())
// addGoalieBoxscore().then(() => mongoose.connection.close())
// populatePlayerBoxscores().then(() => mongoose.connection.close())
// populatePlayer().then(() => mongoose.connection.close())
// generatePlayerLinks().then(() => mongoose.connection.close())
// generateTeamLinks().then(() => mongoose.connection.close())
// deleteAllStarGames().then(() => mongoose.connection.close())
// addTeamsToBoxscores().then(() => mongoose.connection.close())
// addNationalities().then(() => mongoose.connection.close())
// addPointsToBoxscores().then(() => mongoose.connection.close())
// addLinescoreArrays().then(() => mongoose.connection.close())
// deleteLinescores().then(() => mongoose.connection.close())
// getDate().then(() => mongoose.connection.close())
// updatePlayerTeam().then(() => mongoose.connection.close())
// fetchTweets().then(() => mongoose.connection.close())
verifyBoxscores().then(() => mongoose.connection.close())
// deleteLatestGames().then(() => mongoose.connection.close())
