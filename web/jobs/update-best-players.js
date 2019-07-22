const mongoose = require('mongoose')
const Player = require('../models/player')
require('../models/skater-boxscore')
const bestPlayers = require('../models/best-players')
const { getBestPlayers } = require('./helpers/get-best-players')

const config = require('../utils/config')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const updateBestPlayers = async () => {
  const players = await Player.find({
    boxscoreType: 'SkaterBoxscore',
  }).populate('boxscores')

  const playersJSON = players.map(player => player.toJSON())
  const oneGame = JSON.stringify(getBestPlayers(playersJSON, 1))
  const threeGames = JSON.stringify(getBestPlayers(playersJSON, 3))
  const fiveGames = JSON.stringify(getBestPlayers(playersJSON, 5))
  const tenGames = JSON.stringify(getBestPlayers(playersJSON, 10))

  const newBestPlayers = new bestPlayers({
    oneGame,
    threeGames,
    fiveGames,
    tenGames,
  })

  await newBestPlayers.save()
}

updateBestPlayers().then(() => mongoose.connection.close())
