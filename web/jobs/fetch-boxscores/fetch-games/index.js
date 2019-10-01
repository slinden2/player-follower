const axios = require('axios')
const handleGames = require('./handle-games')
const fetchBoxscore = require('../fetch-boxscore')

const gamesUrl = date =>
  `https://statsapi.web.nhl.com/api/v1/schedule?date=${date}`

const fetchGames = async date => {
  const url = gamesUrl(date)
  console.log(`fetch-boxscore.fetchGames - url: ${url}`)

  try {
    const {
      data: { dates },
    } = await axios.get(url)

    if (!dates.length) {
      throw new Error(`No games available: ${url}`)
    }

    const { games } = dates[0]

    const insertedGames = await handleGames(games)

    for (const game of insertedGames) {
      const { gamePk, gameDate } = game
      console.log(
        `fetch-boxscores.fetchGames - gamePk: ${gamePk} | gameDate: ${gameDate}`
      )
      try {
        await fetchBoxscore(gamePk, gameDate)
      } catch ({ name, message }) {
        console.error(
          `fetch-boxscores.fetchBoxscore - gamePk: ${gamePk} | gameDate: ${gameDate}`
        )
        console.error(`${name}: ${message}`)
      }
    }
  } catch ({ name, message }) {
    console.error(`fetch-boxscores.fetch-games.fetchGames - date: ${date}`)
    console.error(`${name}: ${message}`)
  }
}

module.exports = fetchGames
