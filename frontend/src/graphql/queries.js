import { gql } from 'apollo-boost'

const PLAYER_DETAILS = gql`
  fragment PlayerDetails on Player {
    firstName
    lastName
    primaryNumber
    playerId
    id
    numOfGamesId
    stats {
      gamePks
      goals
      assists
      points
      plusMinus
      penaltyMinutes
    }
  }
`

const BEST_PLAYERS = gql`
  query getBestPlayers {
    bestPlayers {
      oneGame {
        ...PlayerDetails
      }
      fiveGames {
        ...PlayerDetails
      }
      tenGames {
        ...PlayerDetails
      }
    }
  }
  ${PLAYER_DETAILS}
`

const FAVORITE_PLAYERS = gql`
  query getFavoritePlayers {
    favoritePlayers {
      oneGame {
        ...PlayerDetails
      }
      fiveGames {
        ...PlayerDetails
      }
      tenGames {
        ...PlayerDetails
      }
    }
  }
  ${PLAYER_DETAILS}
`

const USER = gql`
  query loggedUser {
    me {
      username
      email
      favoritePlayers
    }
  }
`

const FIND_BY_NAME = gql`
  query findByName($searchString: String!) {
    findByName(searchString: $searchString) {
      fullName
      nationality
      primaryNumber
      id
      playerId
    }
  }
`

const CUMULATIVE_STATS = gql`
  query GetCumulativeStats($offset: Int!) {
    GetCumulativeStats(offset: $offset) {
      fullName
      team
      position
      gamesPlayed
      goals
      assists
      points
      plusMinus
      penaltyMinutes
      pointsPerGame
      gameWinningGoals
      overTimeGoals
      powerPlayGoals
      powerPlayPoints
      shortHandedGoals
      shortHandedPoints
      shots
    }
  }
`

export { BEST_PLAYERS, FAVORITE_PLAYERS, USER, FIND_BY_NAME, CUMULATIVE_STATS }
