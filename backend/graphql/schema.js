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
    siteLink: String!
    name: String!
    teamName: String!
    shortName: String!
    abbreviation: String!
    locationName: String!
    firstYearOfPlay: Int!
    officialSiteUrl: String!
    active: Boolean!
    players: [Player!]!
    rosterStats: [CumulativeStats]
  }

  type TeamProfile {
    _id: ID!
    conference: Conference!
    division: Division!
    teamId: Int!
    link: String!
    siteLink: String!
    name: String!
    teamName: String!
    shortName: String!
    abbreviation: String!
    locationName: String!
    firstYearOfPlay: Int!
    officialSiteUrl: String!
    active: Boolean!
    players: [CumulativeStats!]!
  }

  type Standings {
    _id: ID!
    awayRecord: String!
    blocked: Int!
    conference: Conference!
    division: Division!
    faceOffsTaken: Int!
    faceOffWinPct: String!
    faceOffWins: Int!
    gamesPlayed: Int!
    giveaways: Int!
    goalDiff: Int!
    goalsAgainst: Int!
    goalsAgainstPerGame: String!
    goalsFor: Int!
    goalsForPerGame: String!
    hitsAgainst: Int!
    hitsAgainstPerGame: String!
    hitsFor: Int!
    hitsForPerGame: String!
    homeRecord: String!
    losses: Int!
    otLosses: Int!
    penaltyMinutes: Int!
    pkPct: String!
    pointPct: String!
    points: Int!
    powerPlayGoals: Int!
    powerPlayGoalsAllowed: Int!
    powerPlayOpportunities: Int!
    powerPlayOpportunitiesAllowed: Int!
    ppPct: String!
    regPlusOtWins: Int!
    regWins: Int!
    shootOutWins: Int!
    shotsAgainst: Int!
    shotsAgainstPerGame: String!
    shotsFor: Int!
    shotsForPerGame: String!
    takeaways: Int!
    teamAbbr: String!
    teamName: String!
    teamSiteLink: String!
    wins: Int!
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
    primaryPosition: Position!
    """
    Internal id number from NHL API.
    """
    playerId: Int!
    """
    An array of the boxcores of all the games that the player
    has played. Scratched games are not included.
    """
    boxscores: [Stats!]!
    stats: [Stats!]!
    goals: [Goal]
    id: ID!
    numOfGamesId: Int!
  }

  """
  Shared type for all skater/goalie stats:
  boxscores, cumulative stats, statsNgames
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
    powerPlayPoints: Int! # custom resolver
    powerPlayTimeOnIce: String!

    shortHandedAssists: Int!
    shortHandedGoals: Int!
    shortHandedPoints: Int! # custom resolver
    shortHandedTimeOnIce: String!

    shotPct: Float
    shots: Int!
    timeOnIce: String!

    # Group for all boxscore-only related stats
    faceOffsTaken: Int!
    faceOffWins: Int!
    gameDate: String!
    awayTeam: Team!
    homeTeam: Team!
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
    pointsPerGame: Float!
    overTimeGoals: Int!
    shifts: Int!
    evenTimeOnIcePerGame: String!
    powerPlayTimeOnIcePerGame: String!
    shortHandedTimeOnIcePerGame: String!
    timeOnIcePerGame: String!

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
    wins: Int!
    # you can query only gamesPlayed
  }

  type Position {
    code: String!
    description: String!
    abbreviation: String!
  }

  type StatsNGames {
    oneGame: [PlayerCard!]!
    fiveGames: [PlayerCard!]!
    tenGames: [PlayerCard!]!
  }

  type PlayerCard {
    _id: ID!
    numOfGamesId: Int!
    player: Player!
    stats: Stats!
    team: Team!
  }

  type CumulativeStats {
    _id: ID!
    fullName: String!
    siteLink: String!
    team: String
    teamSiteLink: String
    position: String!
    gamesPlayed: Int!
    assists: Int!
    goals: Int!
    points: Int!
    plusMinus: Int!
    penaltyMinutes: Int!
    pointsPerGame: String!
    powerPlayGoals: Int!
    powerPlayPoints: Int!
    shortHandedGoals: Int!
    shortHandedPoints: Int!
    hits: Int!
    shots: Int!
    shotPct: String!
    faceOffsTaken: Int!
    faceOffPct: String!
    takeaways: Int!
    giveaways: Int!
    blocked: Int!
    timeOnIcePerGame: String!
    powerPlayTimeOnIcePerGame: String!
    shortHandedTimeOnIcePerGame: String!
    sortCode: String!
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

  type Goal {
    id: ID!
    gameDate: String!
    strength: String!
    homeTeam: Team!
    awayTeam: Team!
    periodNumber: String!
    periodTime: String!
    coordinates: Coordinate!
  }

  type Coordinate {
    x: Int!
    y: Int!
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

  type LastUpdate {
    date: String!
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
    PPG
    PPP
    SHG
    SHP
    SHOTS
    SHOT_PCT
    HITS
    FOT
    FO_PCT
    TA
    GA
    TON_PER_GAME
    SHTON_PER_GAME
    PPTON_PER_GAME
    BLOCKED
  }

  enum SortDir {
    ASC
    DESC
  }

  enum PositionFilter {
    ALL
    CENTER
    LEFT
    RIGHT
    FORWARD
    DEFENCE
  }

  enum TeamFilter {
    ALL
    ANA
    ARI
    BOS
    BUF
    CAR
    CGY
    CHI
    CBJ
    COL
    DAL
    DET
    EDM
    FLA
    LAK
    MIN
    MTL
    NSH
    NJD
    NYI
    NYR
    OTT
    PHI
    PIT
    SJS
    STL
    TBL
    TOR
    VAN
    VGK
    WPG
    WSH
  }

  enum NationalityFilter {
    ALL
    CAN
    USA
    SWE
    RUS
    CZE
    FIN
    SVK
    CHE
    DNK
    AUT
    SVN
    DEU
    NOR
    FRA
    LVA
    NLD
    AUS
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
    BestPlayers(
      numOfGames: Int!
      positionFilter: PositionFilter!
      teamFilter: TeamFilter!
      nationalityFilter: NationalityFilter!
      sortBy: SortBy
    ): [PlayerCard!]!
    """
    Returns users favorite players for the last 3, 5 and 10 games.
    """
    FavoritePlayers(
      numOfGames: Int!
      positionFilter: PositionFilter!
      teamFilter: TeamFilter!
      nationalityFilter: NationalityFilter!
      sortBy: SortBy
    ): [PlayerCard]!
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
      positionFilter: PositionFilter!
      teamFilter: TeamFilter!
      nationalityFilter: NationalityFilter!
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
    Fetches teams by name
    """
    GetTeams(searchString: String!): [Team!]!
    """
    Returns a team and its roster
    """
    GetTeam(siteLink: String!): TeamProfile!
    """
    Returns the logged user
    """
    me: User
    """
    Returns the time of the last update of the db
    """
    GetLastUpdate: LastUpdate!
  }

  type Mutation {
    createUser(
      username: String!
      password: String!
      email: String!
      recaptcha: String!
    ): User!
    verifyUser(token: String!): User!
    cancelUser(token: String!): User!
    login(username: String!, password: String!): Token!
    forgotPassword(email: String!): User!
    SetNewPassword(token: String!, password: String!): User!
    ChangePassword(oldPassword: String!, newPassword: String!): User!
    followPlayer(id: String!, followType: FollowType!): Player!
    SendContactForm(
      name: String!
      email: String!
      subject: String!
      message: String!
      recaptcha: String!
    ): Boolean!
  }
`

module.exports = typeDefs
