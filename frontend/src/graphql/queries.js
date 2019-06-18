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

export { LAST_GAMES_STATS }