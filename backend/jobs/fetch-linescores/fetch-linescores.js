const axios = require('axios')
const mongoose = require('mongoose')
const config = require('../../utils/config')
const Team = require('../../models/team')
const Linescore = require('../../models/linescore')
const ScriptState = require('../../models/script-state')
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

const fetchLinescores = async (gameData, gamePks) => {
  const scriptAlreadyRan = await ScriptState.findOne({})
  if (!scriptAlreadyRan.fetchGames) {
    throw new Error(
      `fetch-linescores.fetchLinescores - Games much be fetched first: ${gamePks}`
    )
  } else if (scriptAlreadyRan.fetchLinescores) {
    throw new Error(
      `fetch-goals.fetchLinescores - Linescores have been already fetched for ${gamePks}`
    )
  }

  console.log(
    `fetch-linescore.fetchLinescore.start-fetch - gamePks: ${gamePks}`
  )

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
        `fetch-linescore.fetchLinescore - url: ${contentUrl}`,
        err.stack
      )
    }
  }
  await ScriptState.updateOne({}, { $set: { fetchLinescores: true } })
}

module.exports = fetchLinescores
