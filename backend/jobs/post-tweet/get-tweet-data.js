const Tweet = require('../../models/tweet')
const Player = require('../../models/player')
const { favoritePlayersAggregate } = require('../../graphql/pipelines')

const getTweetData = async dataId => {
  const tweetData = await Tweet.findOne({ dataId })
  const playersAway = await Player.find(
    {
      currentTeam: tweetData.awayTeam,
    },
    { _id: 1, lastName: 1 }
  )
  const playersHome = await Player.find(
    {
      currentTeam: tweetData.homeTeam,
    },
    { _id: 1, lastName: 1 }
  )

  const playerListAway = playersAway.map(player => player._id)
  const playerListHome = playersHome.map(player => player._id)

  const dataPlayersAway = await Player.aggregate(
    favoritePlayersAggregate(playerListAway, 3, 'ALL', 'ALL', 'ALL', 'POINTS')
  )
  const dataPlayersHome = await Player.aggregate(
    favoritePlayersAggregate(playerListHome, 3, 'ALL', 'ALL', 'ALL', 'POINTS')
  )

  return {
    away: {
      team: dataPlayersAway[0].team.abbreviation,
      hashtag: dataPlayersAway[0].team.twitterHashtag,
      player1: {
        lastName: dataPlayersAway[0].player.lastName,
        goals: dataPlayersAway[0].stats.goals,
        assists: dataPlayersAway[0].stats.assists,
        points: dataPlayersAway[0].stats.points,
      },
      player2: {
        lastName: dataPlayersAway[1].player.lastName,
        goals: dataPlayersAway[1].stats.goals,
        assists: dataPlayersAway[1].stats.assists,
        points: dataPlayersAway[1].stats.points,
      },
      player3: {
        lastName: dataPlayersAway[2].player.lastName,
        goals: dataPlayersAway[2].stats.goals,
        assists: dataPlayersAway[2].stats.assists,
        points: dataPlayersAway[2].stats.points,
      },
    },
    home: {
      team: dataPlayersHome[0].team.abbreviation,
      hashtag: dataPlayersHome[0].team.twitterHashtag,
      player1: {
        lastName: dataPlayersHome[0].player.lastName,
        goals: dataPlayersHome[0].stats.goals,
        assists: dataPlayersHome[0].stats.assists,
        points: dataPlayersHome[0].stats.points,
      },
      player2: {
        lastName: dataPlayersHome[1].player.lastName,
        goals: dataPlayersHome[1].stats.goals,
        assists: dataPlayersHome[1].stats.assists,
        points: dataPlayersHome[1].stats.points,
      },
      player3: {
        lastName: dataPlayersHome[2].player.lastName,
        goals: dataPlayersHome[2].stats.goals,
        assists: dataPlayersHome[2].stats.assists,
        points: dataPlayersHome[2].stats.points,
      },
    },
  }
}

module.exports = getTweetData
