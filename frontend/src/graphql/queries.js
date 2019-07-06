import { gql } from 'apollo-boost'

const BEST_PLAYERS = gql`
  query getBestPlayers {
    bestPlayers {
      oneGame {
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
      fiveGames {
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
      tenGames {
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
    }
  }
`

const FAVORITE_PLAYERS = gql`
  query getFavoritePlayers {
    favoritePlayers {
      oneGame {
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
      fiveGames {
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
      tenGames {
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
    }
  }
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

export { BEST_PLAYERS, FAVORITE_PLAYERS, USER, FIND_BY_NAME }
