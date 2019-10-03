const getCookie = name => {
  const value = '; ' + document.cookie
  const parts = value.split('; ' + name + '=')
  if (parts.length === 2) {
    return parts
      .pop()
      .split(';')
      .shift()
  }
}

const removeCookie = name => {
  document.cookie = `${name}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`
}

const setCookie = (name, value, expires) => {
  if (!expires) {
    document.cookie = `${name}=${value}`
  } else {
    const now = new Date()
    now.setDate(now.getDate() + expires)
    const newTime = now.toUTCString()
    document.cookie = `${name}=${value}; expires=${newTime}`
  }
}

// const imgUrl = playerId => `http://3.cdn.nhle.com/photos/mugs/${playerId}.jpg`
const cardImgUrl = playerId =>
  `https://nhl.bamcontent.com/images/headshots/current/168x168/${playerId}.jpg`

const profileImgUrl = playerId =>
  `https://nhl.bamcontent.com/images/actionshots/${playerId}.jpg`

const convertSecsToMMSS = secs => {
  const mins = Math.floor(secs / 60)
  const remaining = secs - 60 * mins
  return `${String(mins).padStart(2, '0')}:${String(remaining).padStart(
    2,
    '0'
  )}`
}

const playerBioData = {
  primaryPosition: {
    id: 'primaryPosition.description',
    title: 'Position',
  },
  birthDate: {
    id: 'birthDate',
    title: 'Birthdate',
  },
  birthCity: {
    id: 'birthCity',
    title: 'Birth City',
  },
  birthState: {
    id: 'birthStateProvince',
    title: 'Birth State',
  },
  nationality: {
    id: 'nationality',
    title: 'Nationality',
  },
  team: {
    id: 'currentTeam.name',
    link: 'currentTeam.siteLink',
    title: 'Team',
  },
  captain: {
    id: 'captain',
    title: 'Captain',
  },
  height: {
    id: 'height',
    title: 'Height',
  },
  weight: {
    id: 'weight',
    title: 'Weight',
  },
  primaryNumber: {
    id: 'primaryNumber',
    title: 'Jersey#',
  },
}

const naviItems = {
  players: {
    exact: true,
    to: '/',
    name: 'players',
  },
  favorites: {
    to: '/favorites',
    name: 'favorites',
    tokenRequired: true,
  },
  stats: {
    to: '/players/stats',
    name: 'stats',
  },
  standings: {
    to: '/teams/standings',
    name: 'standings',
  },
  about: {
    to: '/about',
    name: 'about',
  },
  contact: {
    to: '/contact',
    name: 'contact',
  },
  search: {
    to: '/search',
    name: 'search',
    hideWithSearch: true,
  },
  login: {
    to: '/login',
    name: 'log in',
    noToken: true,
    hideOnDesktop: true,
  },
  loginNav: {
    name: 'log in',
    noToken: true,
    bindTo: 'handleOpenModal',
    hideOnMobile: true,
  },
  signup: {
    to: '/signup',
    name: 'sign up',
    noToken: true,
    hideOnDesktop: true,
  },
  signupNav: {
    name: 'sign up',
    noToken: true,
    bindTo: 'handleOpenModal',
    hideOnMobile: true,
  },
  profile: {
    to: '/profile',
    name: 'profile',
    tokenRequired: true,
  },
  logout: {
    to: '',
    name: 'log out',
    bindTo: 'handleLogout',
    tokenRequired: true,
  },
}

const statHeaders = {
  assists: {
    headerText: 'A',
    id: 'assists',
    title: 'Assists',
    sortString: 'ASSISTS',
    showOnMobile: true,
  },
  blocked: {
    headerText: 'BLK',
    id: 'blocked',
    title: 'Blocked shots',
    sortString: 'BLOCKED',
  },
  faceOffsTaken: {
    headerText: 'FOT',
    id: 'faceOffsTaken',
    title: 'Faceoffs Taken',
    sortString: 'FOT',
  },
  faceOffPct: {
    headerText: 'FO%',
    id: 'faceOffPct',
    title: 'Faceoff Win Percentage',
    sortString: 'FO_PCT',
  },
  fullName: {
    headerText: 'Player',
    id: 'fullName',
    title: 'Full Name',
    sortString: 'PLAYER',
    showOnMobile: true,
    leftAlign: true,
  },
  gamesPlayed: {
    headerText: 'GP',
    id: 'gamesPlayed',
    title: 'Games Played',
    sortString: 'GP',
    showOnMobile: true,
  },
  gameDate: {
    headerText: 'Date',
    id: 'gameDate',
    title: 'Date',
    showOnMobile: true,
  },
  giveaways: {
    headerText: 'GA',
    id: 'giveaways',
    title: 'Giveaways',
    sortString: 'GA',
  },
  goals: {
    headerText: 'G',
    id: 'goals',
    title: 'Goals',
    sortString: 'GOALS',
    showOnMobile: true,
  },
  hits: {
    headerText: 'Hits',
    id: 'hits',
    title: 'Hits',
    sortString: 'HITS',
  },
  penaltyMinutes: {
    headerText: 'PM',
    id: 'penaltyMinutes',
    title: 'Penalty Minutes',
    sortString: 'PM',
    showOnMobile: true,
  },
  plusMinus: {
    headerText: '+/-',
    id: 'plusMinus',
    title: 'Plus/Minus',
    sortString: 'PLUSMINUS',
    showOnMobile: true,
  },
  points: {
    headerText: 'P',
    id: 'points',
    title: 'Points',
    sortString: 'POINTS',
    showOnMobile: true,
  },
  pointsPerGame: {
    headerText: 'P/GP',
    id: 'pointsPerGame',
    title: 'Points per Game',
    sortString: 'POINTS_PER_GAME',
  },
  position: {
    headerText: 'POS',
    id: 'position',
    title: 'Position',
    sortString: 'POSITION',
    showOnMobile: true,
  },
  powerPlayAssists: {
    headerText: 'PPA',
    id: 'powerPlayAssists',
    title: 'Powerplay Assists',
  },
  powerPlayGoals: {
    headerText: 'PPG',
    id: 'powerPlayGoals',
    title: 'Powerplay Goals',
    sortString: 'PPG',
  },
  powerPlayPoints: {
    headerText: 'PPP',
    id: 'powerPlayPoints',
    title: 'Powerplay Points',
    sortString: 'PPP',
  },
  powerPlayTimeOnIce: {
    headerText: 'PPTON',
    id: 'powerPlayTimeOnIce',
    title: 'Power Play Time on Ice',
  },
  powerPlayTimeOnIcePerGame: {
    headerText: 'PPT/GP',
    id: 'powerPlayTimeOnIcePerGame',
    title: 'Power Play Time on Ice per Game',
    sortString: 'PPTON_PER_GAME',
  },
  shortHandedAssists: {
    headerText: 'SHA',
    id: 'shortHandedAssists',
    title: 'Shorthanded Assists',
  },
  shortHandedGoals: {
    headerText: 'SHG',
    id: 'shortHandedGoals',
    title: 'Shorthanded Goals',
    sortString: 'SHG',
  },
  shortHandedPoints: {
    headerText: 'SHP',
    id: 'shortHandedPoints',
    title: 'Shorthanded Points',
    sortString: 'SHP',
  },
  shortHandedTimeOnIce: {
    headerText: 'SHTON',
    id: 'shortHandedTimeOnIce',
    title: 'Shorthanded Time on Ice',
  },
  shortHandedTimeOnIcePerGame: {
    headerText: 'SHT/GP',
    id: 'shortHandedTimeOnIcePerGame',
    title: 'Shorthanded Time on Ice per Game',
    sortString: 'SHTON_PER_GAME',
  },
  shotPct: {
    headerText: 'S%',
    id: 'shotPct',
    title: 'Shot Percentage',
    sortString: 'SHOT_PCT',
  },
  shots: {
    headerText: 'Shots',
    id: 'shots',
    title: 'Shots',
    sortString: 'SHOTS',
  },
  takeaways: {
    headerText: 'TA',
    id: 'takeaways',
    title: 'Takeaways',
    sortString: 'TA',
  },
  team: {
    headerText: 'Team',
    id: 'team',
    title: 'Team',
    sortString: 'TEAM',
    showOnMobile: true,
  },
  teams: {
    headerText: 'Teams',
    id: 'teams',
    title: 'Teams',
    showOnMobile: true,
  },
  timeOnIce: {
    headerText: 'TON',
    id: 'timeOnIce',
    title: 'Time on Ice',
  },
  timeOnIcePerGame: {
    headerText: 'T/GP',
    id: 'timeOnIcePerGame',
    title: 'Time on Ice per Game',
    sortString: 'TON_PER_GAME',
  },
}

const teamStatHeaders = {
  teamName: {
    headerText: 'Team',
    id: 'teamName',
    title: 'Team',
    showOnMobile: true,
    leftAlign: true,
  },
  gamesPlayed: {
    headerText: 'GP',
    id: 'gamesPlayed',
    title: 'Games Played',
    showOnMobile: true,
  },
  wins: {
    headerText: 'W',
    id: 'wins',
    title: 'Wins',
    showOnMobile: true,
  },
  losses: {
    headerText: 'L',
    id: 'losses',
    title: 'Losses',
    showOnMobile: true,
  },
  ties: {
    headerText: 'T',
    id: 'ties',
    title: 'Ties',
    showOnMobile: true,
  },
  otLosses: {
    headerText: 'OT',
    id: 'otLosses',
    title: 'Overtime Losses',
    showOnMobile: true,
  },
  points: {
    headerText: 'P',
    id: 'points',
    title: 'Points',
    showOnMobile: true,
  },
  regPlusOtWins: {
    headerText: 'ROW',
    id: 'regPlusOtWins',
    title: 'Regular & Overtime Wins',
  },
  pointPct: {
    headerText: 'P%',
    id: 'pointPct',
    title: 'Point Percentage',
  },
  goalsFor: {
    headerText: 'GF',
    id: 'goalsFor',
    title: 'Goals For',
  },
  goalsAgainst: {
    headerText: 'GA',
    id: 'goalsAgainst',
    title: 'Goals Against',
  },
  shootoutGamesWon: {
    headerText: 'SOW',
    id: 'shootoutGamesWon',
    title: 'Shootout Wins',
  },
  goalsForPerGame: {
    headerText: 'GF/GP',
    id: 'goalsForPerGame',
    title: 'Goals For per Game',
  },
  goalsAgainstPerGame: {
    headerText: 'GA/GP',
    id: 'goalsAgainstPerGame',
    title: 'Goals Against per Game',
  },
  ppPct: {
    headerText: 'PP%',
    id: 'ppPct',
    title: 'Powerplay Percentage',
  },
  pkPct: {
    headerText: 'PK%',
    id: 'pkPct',
    title: 'Penalty Kill Percentage',
  },
  shotsForPerGame: {
    headerText: 'S/GP',
    id: 'shotsForPerGame',
    title: 'Shots For per Game',
  },
  shotsAgainstPerGame: {
    headerText: 'SA/GP',
    id: 'shotsAgainstPerGame',
    title: 'Shots Against per Game',
  },
  faceOffWinPct: {
    headerText: 'FOW%',
    id: 'faceOffWinPct',
    title: 'Faceoff Win Percentage',
  },
}

const playerStatsHeaders = [
  'fullName',
  'team',
  'position',
  'gamesPlayed',
  'goals',
  'assists',
  'points',
  'plusMinus',
  'penaltyMinutes',
  'pointsPerGame',
  'powerPlayGoals',
  'powerPlayPoints',
  'shortHandedGoals',
  'shortHandedPoints',
  'shots',
  'shotPct',
  'hits',
  'faceOffsTaken',
  'faceOffPct',
  'takeaways',
  'giveaways',
  'blocked',
  'timeOnIcePerGame',
  'powerPlayTimeOnIcePerGame',
  'shortHandedTimeOnIcePerGame',
]

const userProfileHeaders = {
  username: {
    headerText: 'Username',
    id: 'username',
  },
  email: {
    headerText: 'Email',
    id: 'email',
  },
}

const userProfileHeadersToShow = ['username', 'email']

const playerPosFilterItems = [
  {
    key: 'ALL',
    text: 'All positions',
    value: 'ALL',
  },
  {
    key: 'FORWARD',
    text: 'Forwards',
    value: 'FORWARD',
  },
  {
    key: 'DEFENCE',
    text: 'Defencemen',
    value: 'DEFENCE',
  },
]

const playerTeamFilterItems = [
  {
    key: 'ALL',
    text: 'All teams',
    value: 'ALL',
  },
  {
    key: 'ANA',
    text: 'Anaheim Ducks',
    value: 'ANA',
  },
  {
    key: 'ARI',
    text: 'Arizona Coyotes',
    value: 'ARI',
  },
  {
    key: 'BOS',
    text: 'Boston Bruins',
    value: 'BOS',
  },
  {
    key: 'BUF',
    text: 'Buffalo Sabres',
    value: 'BUF',
  },
  {
    key: 'CAR',
    text: 'Carolina Hurricanes',
    value: 'CAR',
  },
  {
    key: 'CGY',
    text: 'Calgary Flames',
    value: 'CGY',
  },
  {
    key: 'CHI',
    text: 'Chicago Blackhawks',
    value: 'CHI',
  },
  {
    key: 'CBJ',
    text: 'Columbus Blue Jackets',
    value: 'CBJ',
  },
  {
    key: 'COL',
    text: 'Colorado Avalanche',
    value: 'COL',
  },
  {
    key: 'DAL',
    text: 'Dallas Stars',
    value: 'DAL',
  },
  {
    key: 'DET',
    text: 'Detroit Red Wings',
    value: 'DET',
  },
  {
    key: 'EDM',
    text: 'Edmonton Oilers',
    value: 'EDM',
  },
  {
    key: 'FLA',
    text: 'Florida Panthers',
    value: 'FLA',
  },
  {
    key: 'LAK',
    text: 'Los Angeles Kings',
    value: 'LAK',
  },
  {
    key: 'MIN',
    text: 'Minnesota Wild',
    value: 'MIN',
  },
  {
    key: 'MTL',
    text: 'Montreal Canadiens',
    value: 'MTL',
  },
  {
    key: 'NSH',
    text: 'Nashville Predators',
    value: 'NSH',
  },
  {
    key: 'NJD',
    text: 'New Jersey Devils',
    value: 'NJD',
  },
  {
    key: 'NYI',
    text: 'New York Islanders',
    value: 'NYI',
  },
  {
    key: 'NYR',
    text: 'New York Rangers',
    value: 'NYR',
  },
  {
    key: 'OTT',
    text: 'Ottawa Senators',
    value: 'OTT',
  },
  {
    key: 'PHI',
    text: 'Philadelphia Flyers',
    value: 'PHI',
  },
  {
    key: 'PIT',
    text: 'Pittsburgh Penguins',
    value: 'PIT',
  },
  {
    key: 'SJS',
    text: 'San Jose Sharks',
    value: 'SJS',
  },
  {
    key: 'STL',
    text: 'St. Louis Blues',
    value: 'STL',
  },
  {
    key: 'TBL',
    text: 'Tampa Bay Lightning',
    value: 'TBL',
  },
  {
    key: 'TOR',
    text: 'Toronto Maple Leafs',
    value: 'TOR',
  },
  {
    key: 'VAN',
    text: 'Vancouver Canucks',
    value: 'VAN',
  },
  {
    key: 'VGK',
    text: 'Vegas Golden Knights',
    value: 'VGK',
  },
  {
    key: 'WPG',
    text: 'Winnipeg Jets',
    value: 'WPG',
  },
  {
    key: 'WSH',
    text: 'Washington Capitals',
    value: 'WSH',
  },
]

const playerNationalityFilterItems = [
  {
    key: 'ALL',
    text: 'All countries',
    value: 'ALL',
  },
  {
    key: 'AUS',
    text: 'Australia',
    value: 'AUS',
  },
  {
    key: 'AUT',
    text: 'Austria',
    value: 'AUT',
  },
  {
    key: 'CAN',
    text: 'Canada',
    value: 'CAN',
  },
  {
    key: 'CZE',
    text: 'Czech Republic',
    value: 'CZE',
  },
  {
    key: 'DNK',
    text: 'Denmark',
    value: 'DNK',
  },
  {
    key: 'FIN',
    text: 'Finland',
    value: 'FIN',
  },
  {
    key: 'FRA',
    text: 'France',
    value: 'FRA',
  },
  {
    key: 'DEU',
    text: 'Germany',
    value: 'DEU',
  },
  {
    key: 'LVA',
    text: 'Latvia',
    value: 'LVA',
  },
  {
    key: 'NLD',
    text: 'Netherlands',
    value: 'NLD',
  },
  {
    key: 'NOR',
    text: 'Norway',
    value: 'NOR',
  },
  {
    key: 'RUS',
    text: 'Russia',
    value: 'RUS',
  },
  {
    key: 'SVK',
    text: 'Slovakia',
    value: 'SVK',
  },
  {
    key: 'SVN',
    text: 'Slovenia',
    value: 'SVN',
  },
  {
    key: 'SWE',
    text: 'Sweden',
    value: 'SWE',
  },
  {
    key: 'CHE',
    text: 'Switzerland',
    value: 'CHE',
  },
  {
    key: 'USA',
    text: 'United States',
    value: 'USA',
  },
]

export {
  getCookie,
  removeCookie,
  setCookie,
  cardImgUrl,
  profileImgUrl,
  convertSecsToMMSS,
  naviItems,
  statHeaders,
  teamStatHeaders,
  playerBioData,
  playerStatsHeaders,
  userProfileHeaders,
  userProfileHeadersToShow,
  playerPosFilterItems,
  playerTeamFilterItems,
  playerNationalityFilterItems,
}
