const axios = require('axios')
const mongoose = require('mongoose')
const Player = require('../models/player')
const Team = require('../models/team')
const config = require('../utils/config')
const { createPlayerObject } = require('./fetch-helpers')

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

const playerId = process.argv[2]

if (!playerId) throw new Error('You must provide a player ID')

const contentUrl = playerId =>
  `https://statsapi.web.nhl.com/api/v1/people/${playerId}`

const fetchPlayer = async playerId => {
  const { data } = await axios.get(contentUrl(playerId))
  const player = data.people[0]

  const boxscoreType =
    player.primaryPosition.code === 'G' ? 'GoalieBoxscore' : 'SkaterBoxscore'

  const team = await Team.findOne({ teamId: player.currentTeam.id }, { _id: 1 })

  const playerObj = createPlayerObject(player, team, boxscoreType)

  await new Player(playerObj).save()
}

fetchPlayer(playerId)
  .catch(err =>
    console.error(
      `fetch-player.fetchPlayer - playerId: ${playerId}\n`,
      err.stack
    )
  )
  .then(() => mongoose.connection.close())
