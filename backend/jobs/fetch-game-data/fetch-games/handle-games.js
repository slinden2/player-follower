const axios = require('axios')
const Game = require('../../../models/game')
const Team = require('../../../models/team')
const createMilestones = require('./create-milestones')
const createVideoData = require('./create-video-data')
const { convertMMSStoSec } = require('../../helpers/fetch-helpers')

const contentUrl = gamePk =>
  `https://statsapi.web.nhl.com/api/v1/game/${gamePk}/content`

const handleGames = async games => {
  let gameArray = []

  let insertedGames
  let url
  for (const game of games) {
    try {
      url = contentUrl(game.gamePk)
      console.log(
        `fetch-boxcores.fetchGames.handleGames.contentUrl - url: ${url}`
      )

      const {
        data: { media },
      } = await axios.get(url)

      const awayTeam = await Team.findOne(
        { teamId: game.teams.away.team.id },
        { _id: 1, teamId: 1 }
      )

      const homeTeam = await Team.findOne(
        { teamId: game.teams.home.team.id },
        { _id: 1, teamId: 1 }
      )

      const condensedGame = media.epg.find(
        category => category.title === 'Extended Highlights'
      )

      const gameRecap = media.epg.find(category => category.title === 'Recap')

      const createdMilestones = await createMilestones(
        media,
        game,
        awayTeam,
        homeTeam
      )

      const milestoneIds = createdMilestones.map(milestone => milestone._id)

      const newGame = {
        gamePk: game.gamePk,
        liveLink: game.link,
        contentLink: game.content.link,
        gameDate: game.gameDate,
        gameType: game.gameType,
        awayTeam: {
          team: awayTeam._id,
          score: game.teams.away.score,
        },
        homeTeam: {
          team: homeTeam._id,
          score: game.teams.home.score,
        },
        gameCondensed: createVideoData(condensedGame.items[0]),
        gameRecap: createVideoData(gameRecap.items[0]),
        milestones: milestoneIds,
      }

      gameArray = [...gameArray, newGame]
    } catch ({ name, message }) {
      console.error(
        `fetch-game-data.fetchGames.handleGames - gamePk: ${game.gamePk}, url: ${url}`
      )
    }
  }

  insertedGames = await Game.insertMany(gameArray)
  return insertedGames
}

module.exports = handleGames
