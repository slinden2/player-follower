const { gql } = require('apollo-server')

const typeDefs = gql`
  "Contains player general info"
  type Player {
    """
    Link that leads to the player details in the API
    """
    link: String!
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
    currentTeam: Int!
    primaryPosition: String!
    """
    Internal id number from NHL API.
    """
    playerId: Int!
    """
    An array of the boxcores of all the games that the player
    has played. Scratched games are not included.
    """
    boxscores: [Stat!]!
    stats: Stat!
    id: ID!
    numOfGamesId: Int
  }

  "Boxscore per game"
  type Stat {
    """
    Internal progressive game id from NHL API.
    Each game has an id, so each gamePk is related
    to the players of two different teams.
    """
    gamePk: Int!
    """
    Array of games that are considered in the calculated stats.
    """
    gamePks: [Int]
    """
    UTC seconds for the moment the data was fetched
    """
    date: Int!
    """
    Total number of played games
    """
    numOfGames: Int
    timeOnIce: Int!
    assists: Int!
    goals: Int!
    points: Int!
    shots: Int!
    shotPct: Float
    hits: Int
    powerPlayGoals: Int
    powerPlayAssists: Int
    penaltyMinutes: Int!
    faceOffWins: Int
    faceoffTaken: Int
    faceOffPct: Float
    takeaways: Int
    giveaways: Int
    shortHandedGoals: Int
    shortHandedAssists: Int
    blocked: Int
    plusMinus: Int
    evenTimeOnIce: Int
    powerPlayTimeOnIce: Int
    shortHandedTimeOnIce: Int
    # Only goalie stats below
    saves: Int
    """
    savePct considers only 1 game. If you need more games, use
    savePctTotal.
    """
    savePct: Float
    """
    savePct over multiple games.
    """
    powerPlaySaves: Int
    shortHandedSaves: Int
    evenSaves: Int
    shortHandedShotsAgainst: Int
    evenShotsAgainst: Int
    powerPlayShotsAgainst: Int
    decision: String
    id: ID!
    # Stats below are queryable only with getStatsInRange
    timeOnIcePerGame: Int
    evenTimeOnIcePerGame: Int
    powerPlayTimeOnIcePerGame: Int
    shortHandedTimeOnIcePerGame: Int
    savePctTotal: Float
  }

  type PeriodStats {
    oneGame: [Player]
    fiveGames: [Player]
    tenGames: [Player]
  }

  type CumulativeStats {
    fullName: String!
    team: String!
    position: String!
    gamesPlayed: Int!
    goals: Int!
    assists: Int!
    points: Int!
    plusMinus: Int!
    penaltyMinutes: Int!
    pointsPerGame: Int!
    gameWinningGoals: Int!
    overTimeGoals: Int!
    powerPlayGoals: Int!
    powerPlayerPoints: Int!
    shortHandedGoals: Int!
    shortHandedPoints: Int!
    shots: Int!
  }

  type Standings {
    team: String!
    wins: Int!
    losses: Int!
    ot: Int!
    goalsAgainst: Int!
    goalsScored: Int!
    points: Int!
    gamesPlayed: Int!
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

  enum StandingsType {
    DIVISION
    CONFERENCE
    LEAGUE
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
    bestPlayers: PeriodStats!
    """
    Returns users favorite players for the last 3, 5 and 10 games.
    """
    favoritePlayers: PeriodStats!
    """
    Single player by playerId
    """
    findPlayer(playerId: Int!): Player!
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
    GetCumulativeStats: [CumulativeStats!]!
    """
    Team standings.
    """
    standings(type: StandingsType): [Standings]!
    """
    Used for player search field.
    """
    findByName(searchString: String!): [Player]!
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
