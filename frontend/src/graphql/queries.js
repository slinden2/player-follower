import { gql } from 'apollo-boost'

const PLAYER_DETAILS = gql`
  fragment PlayerDetails on PlayerCard {
    firstName
    lastName
    primaryNumber
    playerId
    id
    numOfGamesId
    siteLink
    stats {
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

const PLAYER_PROFILE = gql`
  query getPlayerProfile($siteLink: String!) {
    findPlayer(siteLink: $siteLink) {
      id
      fullName
      primaryNumber
      birthDate
      birthCity
      birthStateProvince
      nationality
      height
      weight
      alternateCaptain
      captain
      rookie
      shootsCatches
      currentTeam {
        name
        abbreviation
        locationName
      }
      primaryPosition
      playerId
      boxscores {
        id
        assists
        blocked
        faceOffsTaken
        faceOffWins
        gameDate
        gamePk
        giveaways
        goals
        hits
        penaltyMinutes
        plusMinus
        points
        powerPlayAssists
        powerPlayGoals
        powerPlayTimeOnIce
        shortHandedAssists
        shortHandedGoals
        shortHandedTimeOnIce
        shotPct
        shots
        takeaways
        timeOnIce
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

const CUMULATIVE_STATS = gql`
  query GetCumulativeStats(
    $offset: Int!
    $sortBy: SortBy!
    $sortDir: SortDir!
  ) {
    GetCumulativeStats(offset: $offset, sortBy: $sortBy, sortDir: $sortDir) {
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

const STANDINGS = gql`
  query getStandings {
    Standings {
      teamName
      gamesPlayed
      wins
      losses
      ties
      otLosses
      points
      regPlusOtWins
      pointPct
      goalsFor
      goalsAgainst
      shootoutGamesWon
      goalsForPerGame
      goalsAgainstPerGame
      ppPct
      pkPct
      shotsForPerGame
      shotsAgainstPerGame
      faceOffWinPct
      conference {
        name
      }
      division {
        name
      }
    }
  }
`

export {
  BEST_PLAYERS,
  FAVORITE_PLAYERS,
  USER,
  FIND_BY_NAME,
  CUMULATIVE_STATS,
  STANDINGS,
  PLAYER_PROFILE,
}
