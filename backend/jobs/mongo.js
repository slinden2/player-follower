const config = require('../utils/config')
const mongoose = require('mongoose')
const Player = require('../models/player')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const fetch = async () => {
  const players = await Player.find()
  return players
}

const remove = async () => {
  await Player.remove({})
  mongoose.connection.close()
}

remove()

// fetch().then(players => {
//   mongoose.connection.close()
//   const filtered = players.filter(p => p.stats.length === 1)
//   console.log(filtered);
//   console.log(players.length)
//   for (const player of players) {
//     console.log(player.fullName)
//   }  
// })
