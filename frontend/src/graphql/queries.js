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
      timeOnIcePerGame
      shots
      powerPlayGoals
      powerPlayPoints
      shortHandedGoals
      shortHandedPoints
      faceOffsTaken
      hits
      blocked
      giveaways
      takeaways
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
      primaryPosition {
        code
        description
      }
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
        homeTeam {
          abbreviation
        }
        awayTeam {
          abbreviation
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
      currentTeam {
        abbreviation
      }
      id
      playerId
      siteLink
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
      id
      fullName
      siteLink
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
      id
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

const PLAYER_MILESTONES = gql`
  query getPlayerMilestones($playerId: Int!, $gamePks: [Int!]!) {
    GetMilestones(playerId: $playerId, gamePks: $gamePks) {
      gamePk
      title
      description
      blurb
      playback {
        width
        height
        url
      }
    }
  }
`

const GET_TEAMS_BY_NAME = gql`
  query getTeamsByName($searchString: String!) {
    GetTeams(searchString: $searchString) {
      name
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
  PLAYER_MILESTONES,
  GET_TEAMS_BY_NAME,
}
