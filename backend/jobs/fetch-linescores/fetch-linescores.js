const axios = require('axios')
const mongoose = require('mongoose')
const config = require('../../utils/config')
const Team = require('../../models/team')
const Linescore = require('../../models/linescore')
const getLinescoreObject = require('./get-linescore-object')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const contentUrl = gamePk =>
  `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/feed/live`

const fetchLinescores = async gameData => {
  console.log('fetch-linescore.fetchLinescore - Starting to fetch...')

  for (const game of gameData) {
    try {
      const url = contentUrl(game.gamePk)
      console.log(`fetch-linescore.fetchLinescore - url: ${url}`)
      const {
        data: { liveData },
      } = await axios.get(contentUrl(game.gamePk))
      const { linescore, boxscore } = liveData

      const awayTeam = await Team.findOne(
        {
          _id: game.awayTeam.team,
        },
        { abbreviation: 1, linescores: 1 }
      )

      const homeTeam = await Team.findOne(
        {
          _id: game.homeTeam.team,
        },
        { abbreviation: 1, linescores: 1 }
      )

      const awayData = getLinescoreObject(
        game,
        awayTeam,
        homeTeam,
        linescore,
        boxscore,
        false
      )

      const homeData = getLinescoreObject(
        game,
        awayTeam,
        homeTeam,
        linescore,
        boxscore,
        true
      )

      const [
        savedAwayLinescore,
        savedHomeLinescore,
      ] = await Linescore.insertMany([awayData, homeData])

      awayTeam.linescores = [...awayTeam.linescores, savedAwayLinescore._id]
      homeTeam.linescores = [...homeTeam.linescores, savedHomeLinescore._id]
      game.awayLinescore = savedAwayLinescore._id
      game.homeLinescore = savedHomeLinescore._id

      await Promise.all([game.save(), awayTeam.save(), homeTeam.save()])
      console.log('fetch-linescore.fetchLinescore - Linescore saved.')
    } catch (err) {
      console.error(
        `fetch-linescore.fetchLinescore - url: ${contentUrl}\n`,
        err.stack
      )
    }
  }
}

module.exports = fetchLinescores
