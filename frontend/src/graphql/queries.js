import { gql } from 'apollo-boost'

const BEST_PLAYERS = gql`
  query getBestPlayers {
    bestPlayers {
      threeGames {
        firstName
        lastName
        primaryNumber
        playerId
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
    }
  }
`

export { BEST_PLAYERS, USER }
