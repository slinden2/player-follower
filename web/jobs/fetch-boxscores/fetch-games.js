const axios = require('axios')
const fetchBoxscore = require('./fetch-boxscore')

const gamesUrl = date =>
  `https://statsapi.web.nhl.com/api/v1/schedule?date=${date}`

const fetchGames = async date => {
  const url = gamesUrl(date)

  try {
    const {
      data: { dates },
    } = await axios.get(url)

    if (!dates.length) {
      throw new Error(`No games available: ${url}`)
    }

    const { games } = dates[0]

    for (const game of games) {
      const { gamePk, gameDate } = game
      console.log(
        `fetch-boxscores.fetch-games.fetchGames-gamePk/gameDate: ${gamePk}/${gameDate}`
      )
      await fetchBoxscore(gamePk, gameDate)
    }
  } catch ({ name, message }) {
    console.error(
      `fetch-boxscores.fetch-games.fetchGames.error-while-fetching-games-${date}`
    )
    console.error(`${name}: ${message}`)
  }
}

module.exports = fetchGames
