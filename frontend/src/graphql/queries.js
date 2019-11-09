import { gql } from 'apollo-boost'

const PLAYER_CARD_BIO = gql`
  fragment PlayerCardBio on PlayerCard {
    _id
    numOfGamesId
    player {
      firstName
      lastName
      primaryNumber
      primaryPosition {
        abbreviation
      }
      playerId
      siteLink
    }
    team {
      abbreviation
      siteLink
    }
  }
`

const PLAYER_DETAILS = gql`
  fragment PlayerStats on PlayerCard {
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
  query getBestPlayers(
    $numOfGames: Int!
    $positionFilter: PositionFilter!
    $teamFilter: TeamFilter!
    $nationalityFilter: NationalityFilter!
    $sortBy: SortBy
  ) {
    BestPlayers(
      numOfGames: $numOfGames
      positionFilter: $positionFilter
      teamFilter: $teamFilter
      nationalityFilter: $nationalityFilter
      sortBy: $sortBy
    ) {
      ...PlayerCardBio
      ...PlayerStats
    }
  }
  ${PLAYER_CARD_BIO}
  ${PLAYER_DETAILS}
`

const BEST_GOALIES = gql`
  query getBestGoalies(
    $numOfGames: Int!
    $positionFilter: PositionFilter!
    $teamFilter: TeamFilter!
    $nationalityFilter: NationalityFilter!
    $sortBy: SortBy
  ) {
    BestGoalies(
      numOfGames: $numOfGames
      positionFilter: $positionFilter
      teamFilter: $teamFilter
      nationalityFilter: $nationalityFilter
      sortBy: $sortBy
    ) {
      ...PlayerCardBio
      stats {
        wins
        losses
        shutouts
        savePct
        goalsAgainstAverage
        powerPlaySavePct
        powerPlayShotsAgainst
        shortHandedSavePct
        shortHandedShotsAgainst
        savesPerGame
        shotsAgainstPerGame
        winPct
        goals
        assists
        penaltyMinutes
      }
    }
  }
  ${PLAYER_CARD_BIO}
`

const FAVORITE_PLAYERS = gql`
  query getFavoritePlayers(
    $numOfGames: Int!
    $positionFilter: PositionFilter!
    $teamFilter: TeamFilter!
    $nationalityFilter: NationalityFilter!
    $sortBy: SortBy
  ) {
    FavoritePlayers(
      numOfGames: $numOfGames
      positionFilter: $positionFilter
      teamFilter: $teamFilter
      nationalityFilter: $nationalityFilter
      sortBy: $sortBy
    ) {
      ...PlayerCardBio
      ...PlayerStats
    }
  }
  ${PLAYER_CARD_BIO}
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
        siteLink
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
      goals {
        id
        strength
        homeTeam {
          abbreviation
        }
        awayTeam {
          abbreviation
        }
        gameDate
        periodNumber
        periodTime
        coordinates {
          x
          y
        }
      }
    }
  }
`

const BEST_TEAMS = gql`
  query bestTeams($numOfGames: Int!) {
    BestTeams(numOfGames: $numOfGames) {
      _id
      numOfGamesId
      team {
        name
        teamName
        locationName
        abbreviation
        siteLink
      }
      conference {
        name
        abbreviation
      }
      division {
        name
        abbreviation
      }
      stats {
        wins
        losses
        otLosses
        homeRecord
        awayRecord
        points
        regPlusOtWins
        pointPct
        goalsFor
        goalsAgainst
        shootOutWins
        goalsForPerGame
        goalsAgainstPerGame
        ppPct
        pkPct
        powerPlayGoals
        powerPlayOpportunitiesAllowed
        takeaways
        giveaways
        shotsForPerGame
        shotsAgainstPerGame
        faceOffWinPct
        hitsForPerGame
        hitsAgainstPerGame
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
    $positionFilter: PositionFilter!
    $teamFilter: TeamFilter!
    $nationalityFilter: NationalityFilter!
    $offset: Int!
    $sortBy: SortBy!
    $sortDir: SortDir!
  ) {
    GetCumulativeStats(
      positionFilter: $positionFilter
      teamFilter: $teamFilter
      nationalityFilter: $nationalityFilter
      offset: $offset
      sortBy: $sortBy
      sortDir: $sortDir
    ) {
      _id
      fullName
      siteLink
      team
      teamSiteLink
      position
      gamesPlayed
      goals
      assists
      points
      plusMinus
      penaltyMinutes
      pointsPerGame
      powerPlayGoals
      powerPlayPoints
      shortHandedGoals
      shortHandedPoints
      shots
      shotPct
      hits
      faceOffsTaken
      faceOffPct
      takeaways
      giveaways
      timeOnIcePerGame
      powerPlayTimeOnIcePerGame
      shortHandedTimeOnIcePerGame
      blocked
      sortCode
    }
  }
`

const STANDINGS = gql`
  query getStandings {
    Standings {
      _id
      teamName
      teamSiteLink
      gamesPlayed
      wins
      losses
      otLosses
      otWins
      points
      regPlusOtWins
      pointPct
      goalsFor
      goalsAgainst
      shootOutWins
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
      siteLink
    }
  }
`

const TEAM_PROFILE = gql`
  query getTeamByName($siteLink: String!) {
    GetTeam(siteLink: $siteLink) {
      name
      abbreviation
      players {
        _id
        fullName
        siteLink
        gamesPlayed
        position
        goals
        assists
        points
        plusMinus
        penaltyMinutes
        pointsPerGame
        timeOnIcePerGame
        powerPlayTimeOnIcePerGame
        shortHandedTimeOnIcePerGame
        shots
        shotPct
        powerPlayGoals
        powerPlayPoints
        shortHandedGoals
        shortHandedPoints
        faceOffsTaken
        faceOffPct
        hits
        blocked
        giveaways
        takeaways
      }
    }
  }
`

const LAST_UPDATE = gql`
  query GetLastUpdate {
    GetLastUpdate {
      date
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
  BEST_TEAMS,
  BEST_GOALIES,
  PLAYER_PROFILE,
  PLAYER_MILESTONES,
  GET_TEAMS_BY_NAME,
  TEAM_PROFILE,
  LAST_UPDATE,
}
