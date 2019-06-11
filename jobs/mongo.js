const config = require('../utils/config')
const mongoose = require('mongoose')
const Player = require('../models/player')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const fetch = async () => {
  const players = await Player.find({ currentTeam: 15 })
  console.log(players)
}

fetch().then(() => mongoose.connection.close())