const axios = require('axios')
const mongoose = require('mongoose')
const Twitter = require('twitter')
const Conference = require('../models/conference')
const Division = require('../models/division')
const Team = require('../models/team')
const Player = require('../models/player')
const SkaterBoxscore = require('../models/skater-boxscore')
const GoalieBoxscore = require('../models/goalie-boxscore')
const TeamStats = require('../models/team-stats')
const Linescore = require('../models/linescore')
const ScriptState = require('../models/script-state')
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

const createAllRosters = async () => {
  const teams = await Team.find()

  for (const team of teams) {
    const players = await Player.find({ currentTeam: team._id })
    const playerIds = players.map(player => player._id)
    team.players = playerIds
    await team.save()
  }
}

const updatePlayerTeam = async () => {
  const contentUrl = playerId =>
    `https://statsapi.web.nhl.com/api/v1/people/${playerId}`

  const players = await Player.find(
    {},
    { playerId: 1, lastName: 1, currentTeam: 1 }
  ).populate('currentTeam', { teamId: 1, teamName: 1 })

  // This will be set to true if the currentTeam field of a player
  // has changed. If changes have taken place, the team rosters
  // will be recreated.
  let tradesHappened = false

  for (const player of players) {
    const {
      data: { people },
    } = await axios.get(contentUrl(player.playerId))
    const newTeamId = people[0].currentTeam.id

    // Compare currentTeam field in DB to currentTeam in API
    if (player.currentTeam.teamId !== newTeamId) {
      tradesHappened = true

      // Get previous team from DB (where the player will play before trade)
      const prevTeam = await Team.findOne(
        { _id: player.currentTeam._id },
        { teamName: 1 }
      )

      // Get new team from DB (where the player will play after trade)
      const newTeam = await Team.findOne({ teamId: newTeamId }, { teamName: 1 })

      console.log('*'.repeat(50))
      console.log(`Data currently in DB:
Player data:
  _id: ${player._id}
  lastName: ${player.lastName}
Team data:
  _id: ${prevTeam._id}
  teamName: ${prevTeam.teamName}
`)
      console.log('='.repeat(25))

      console.log(`New team data:
Team data:
  _id: ${newTeam._id}
  teamName: ${newTeam.teamName}
`)
      console.log('='.repeat(25))

      // Update players currentTeam with new id and save the player.
      player.currentTeam = newTeam._id
      const savedPlayer = await player.save()
      console.log(
        `Player ${savedPlayer._id} saved with new currentTeam: ${savedPlayer.currentTeam}.`
      )
      console.log('*'.repeat(50))
      console.log('')
    }
  }

  if (tradesHappened) {
    console.log('Updating team rosters...')
    const teams = await Team.find()

    for (const team of teams) {
      const players = await Player.find({ currentTeam: team._id })
      const playerIds = players.map(player => player._id)
      team.players = playerIds
      await team.save()
    }
    console.log('Rosters updated.')
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

const updateMilestoneData = async () => {
  const milestones = await Milestone.find({})

  for (const milestone of milestones) {
    const milestoneJSON = milestone.toJSON()
    const player = await Player.findOne(
      { playerId: milestoneJSON.playerId },
      { _id: 1 }
    )
    const team = await Team.findOne(
      { teamId: milestoneJSON.teamId },
      { _id: 1 }
    )
    const opponent = await Team.findOne(
      { teamId: milestoneJSON.opponentId },
      { _id: 1 }
    )

    await Milestone.updateOne(
      { _id: milestoneJSON.id },
      {
        $set: { player, team, opponent },
      }
    )
  }
}

const addDateToLinescores = async () => {
  const gamePks = await Linescore.distinct('gamePk')

  for (const gamePk of gamePks) {
    const response = await axios.get(
      `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/feed/live`
    )

    const gameDate = response.data.gameData.datetime.dateTime

    await Linescore.updateMany({ gamePk }, { $set: { gameDate } })
  }
}

// db.milestones.updateOne(
//   { 'highlight.playbacks._id': ObjectId('5de3975166713950d4dde4e4') },
//   { $set: { 'highlight.playbacks.$[el].urlMissing': true } },
//   { arrayFilters: [{ 'el.name': 'FLASH_1800K_896x504' }] }
// )

const deleteLatestGames = async () => {
  const gamePk = 2019020947 // gamePk greater than this will be deleted

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

const deleteErroneousBoxscoresFromPlayers = async () => {
  const falsyBoxscores = ['arrayofboxscoreids']

  for (const bsId of falsyBoxscores) {
    const player = await Player.findOne({ boxscores: bsId })
    player.boxscores = player.boxscores.filter(
      bs => String(bs) !== String(bsId)
    )
    await player.save()
  }
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
// createAllRosters().then(() => mongoose.connection.close())
// updatePlayerTeam().then(() => mongoose.connection.close())
// fetchTweets().then(() => mongoose.connection.close())
// updateMilestoneData().then(() => mongoose.connection.close())
// addDateToLinescores().then(() => mongoose.connection.close())
// deleteErroneousBoxscoresFromPlayers().then(() => mongoose.connection.close())
deleteLatestGames().then(() => mongoose.connection.close())
