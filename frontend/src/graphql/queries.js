import { gql } from 'apollo-boost'

const LAST_GAMES_STATS = gql`
  query getLastGamesStatsByPlayerId($playerId: Int!, $numOfGames: Int) {
    getStatsInRange(playerId: $playerId, numOfGames: $numOfGames) {
      fullName
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
