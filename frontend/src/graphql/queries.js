import { gql } from 'apollo-boost'

const LAST_GAMES_STATS = gql`
  query getLastGamesStatsByPlayerIds($playerIds: [Int!]!, $numOfGames: Int) {
    getStatsInRange(playerIds: $playerIds, numOfGames: $numOfGames) {
      firstName
      lastName
      primaryNumber
      playerId
      stats {
        goals
        assists
        points
        plusMinus
        penaltyMinutes
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

export { LAST_GAMES_STATS, USER }
