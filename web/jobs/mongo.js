const config = require('../utils/config')
const mongoose = require('mongoose')
const Player = require('../models/player')

mongoose.connect(config.DEV_MONGODB_URI, { useNewUrlParser: true })

const updateBirthdate = async () => {
  const players = await Player.find({})
  for (const player of players) {
    player.birthDate = JSON.stringify(player.birthDate)
    console.log(player.firstName, player.lastName)
    await player.save()
  }
}

updateBirthdate().then(() => mongoose.connection.close())

// const fetch = async () => {
//   const players = await Player.find()
//   return players
// }

// const remove = async () => {
//   await Player.deleteMany({})
//   mongoose.connection.close()
// }

// remove()

// fetch().then(players => {
//   mongoose.connection.close()
//   const filtered = players.filter(p => p.stats.length === 1)
//   console.log(filtered);
//   console.log(players.length)
//   for (const player of players) {
//     console.log(player.fullName)
//   }
// })
