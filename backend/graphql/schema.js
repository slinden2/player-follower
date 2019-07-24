const { gql } = require('apollo-server')

const typeDefs = gql`
  type Conference {
    id: ID!
    divisions: [Division!]!
    teams: [Team!]!
    conferenceId: Int!
    link: String!
    name: String!
    shortName: String!
    abbreviation: String!
    active: Boolean!
  }

  type Division {
    id: ID!
    conference: Conference!
    teams: [Team!]!
    divisionId: Int!
    link: String!
    name: String!
    shortName: String!
    abbreviation: String!
    active: Boolean!
  }

  type Team {
    id: ID!
    conference: Conference!
    division: Division!
    teamId: Int!
    link: String!
    name: String!
    teamName: String!
    shortName: String!
    abbreviation: String!
    locationName: String!
    firstYearOfPlay: Int!
    officialSiteUrl: String!
    active: Boolean!
  }

  type Standings {
    teamName: String!
    teamAbbr: String!
    conference: Conference!
    division: Division!
    gamesPlayed: Int!
    wins: Int!
    losses: Int!
    ties: Int!
    otLosses: Int!
    points: Int!
    regPlusOtWins: Int!
    pointPct: Float!
    goalsFor: Int!
    goalsAgainst: Int!
    shootoutGamesWon: Int!
    goalsForPerGame: Float!
    goalsAgainstPerGame: Float!
    ppPct: Float!
    pkPct: Float!
    shotsForPerGame: Float!
    shotsAgainstPerGame: Float!
    faceOffWinPct: Float!
  }

  """
  Player bio
  """
  type Player {
    """
    Link that leads to the player details in the API
    """
    link: String!
    siteLink: String!
    firstName: String!
    lastName: String!
    fullName: String!
    primaryNumber: Int
    birthDate: String!
    birthCity: String!
    birthStateProvince: String
    birthCountry: String!
    nationality: String!
    """
    Height in cm.
    """
    height: Int!
    """
    Weight in kg.
    """
    weight: Int!
    active: Boolean!
    alternateCaptain: Boolean!
    captain: Boolean!
    rookie: Boolean!
    shootsCatches: String!
    rosterStatus: String!
    currentTeam: Team!
    primaryPosition: String!
    """
    Internal id number from NHL API.
    """
    playerId: Int!
    """
    An array of the boxcores of all the games that the player
    has played. Scratched games are not included.
    """
    boxscores: [Stats!]!
    stats: Stats!
    id: ID!
    numOfGamesId: Int!
  }

  """
  Shared type for all skater/goalie stats:
  boxscores, cumulativeS stats, statsNgames
  """
  type Stats {
    # Group for all the base stats relative to
    # all different queryable stats
    id: ID!
    assists: Int!
    blocked: Int!
    evenTimeOnIce: String!
    goals: Int!
    hits: Int!
    penaltyMinutes: Int!
    plusMinus: Int!
    points: Int!
    powerPlayAssists: Int!
    powerPlayGoals: Int!
    powerPlayTimeOnIce: String!
    shortHandedAssists: Int!
    shortHandedGoals: Int!
    shortHandedTimeOnIce: String!
    shotPct: Float
    shots: Int!
    timeOnIce: String!

    # Group for all boxscore-only related stats
    faceOffsTaken: Int!
    faceOffWins: Int!
    gameDate: String!
    """
    Internal progressive game id from NHL API.
    """
    gamePk: Int!
    giveaways: Int!
    takeaways: Int!

    # Group for all cumulative-stats-only related stats
    faceOffPct: Float!
    gamesPlayed: Int!
    gameWinningGoals: Int!
    shifts: Int!

    # Group for all StatsNGames-only related stats
    """
    Array of gamePks available with StatsNGames type
    """
    gamePks: [Int]

    # Group for all goalie related stats
    evenSavePct: Float!
    evenSaves: Int!
    powerPlaySaves: Int!
    savePct: Float!
    saves: Int!
    shortHandedSavePct: Float!
    shortHandedSaves: Int!
    shortHandedShotsAgainst: Int!
    shotsAgainst: Int!
    # you can query also timeOnIce

    # Group for goalie boxscore-only related stats
    decision: String!
    powerPlayShotsAgainst: Int!
    # available also:
    # assists, goals, gamePk, penaltyMinutes, gameDate

    # Group for goalie cumulative-stats-only related stats
    evenShotsAgainst: Int!
    gamesStarted: Int!
    goalsAgainst: Int!
    goalsAgainstAverage: Float!
    losses: Int!
    ot: Int!
    powerPlaySavePct: Float!
    shutouts: Int!
    timeOnIcePerGame: Int!
    wins: Int!
    # you can query only gamesPlayed
  }

  type StatsNGames {
    oneGame: [PlayerCard!]!
    fiveGames: [PlayerCard!]!
    tenGames: [PlayerCard!]!
  }

  type PlayerCard {
    firstName: String!
    lastName: String!
    primaryNumber: Int
    playerId: Int!
    id: ID!
    numOfGamesId: Int!
    siteLink: String!
    stats: Stats!
  }

  type CumulativeStats {
    fullName: String!
    siteLink: String!
    team: String!
    position: String!
    gamesPlayed: Int!
    goals: Int!
    assists: Int!
    points: Int!
    plusMinus: Int!
    penaltyMinutes: Int!
    pointsPerGame: Float!
    gameWinningGoals: Int!
    overTimeGoals: Int!
    powerPlayGoals: Int!
    powerPlayPoints: Int!
    shortHandedGoals: Int!
    shortHandedPoints: Int!
    shots: Int!
  }

  type PlayerMilestone {
    gamePk: Int!
    title: String!
    description: String!
    blurb: String!
    playback: Video!
  }

  type Video {
    name: String!
    height: Int!
    width: Int!
    url: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    favoritePlayers: [String]!
  }

  type Token {
    value: String!
  }

  enum FollowType {
    FOLLOW
    UNFOLLOW
  }

  enum SortBy {
    PLAYER
    TEAM
    POSITION
    GP
    GOALS
    ASSISTS
    POINTS
    PLUSMINUS
    PM
    POINTS_PER_GAME
    GWG
    OTG
    PPG
    PPP
    SHG
    SHP
    SHOTS
  }

  enum SortDir {
    ASC
    DESC
  }

  type Query {
    playerCount: Int!
    """
    All players in db
    """
    allPlayers: [Player!]!
    """
    Returns best players for the last 3, 5 and 10 games.
    """
    bestPlayers: StatsNGames!
    """
    Returns users favorite players for the last 3, 5 and 10 games.
    """
    favoritePlayers: StatsNGames!
    """
    Single player by playerId
    """
    findPlayer(playerId: Int, siteLink: String): Player!
    """
    Array of players by arbitrary search terms
    """
    findPlayers(
      firstName: String
      lastName: String
      primaryNumber: Int
      birthCity: String
      birthStateProvince: String
      birthCountry: String
      nationality: String
      height: Int
      weight: Int
      active: Boolean
      alternateCaptain: Boolean
      captain: Boolean
      rookie: Boolean
      shootsCatches: String
      primaryPosition: String
    ): [Player!]!
    """
    Cumulative player stats considering all games of the season.
    """
    GetCumulativeStats(
      offset: Int!
      sortBy: SortBy!
      sortDir: SortDir!
    ): [CumulativeStats!]!
    """
    Team standings.
    """
    Standings: [Standings]!
    """
    Used for player search field.
    """
    findByName(searchString: String!): [Player]!
    """
    Fetches game related milestones from the API
    """
    GetMilestones(playerId: Int!, gamePks: [Int!]!): [[PlayerMilestone]!]!
    """
    Returns the logged user
    """
    me: User
  }

  type Mutation {
    createUser(username: String!, password: String!, email: String!): User!
    verifyUser(token: String!): User!
    cancelUser(token: String!): User!
    login(username: String!, password: String!): Token!
    forgotPassword(email: String!): User!
    setNewPassword(token: String!, password: String!): User!
    changePassword(password: String!): User!
    followPlayer(id: String!, followType: FollowType!): Player!
  }
`

module.exports = typeDefs
