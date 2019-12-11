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
    document.cookie = `${name}=${value}; expires=${newTime}; path=/`
  }
}

// const imgUrl = playerId => `http://3.cdn.nhle.com/photos/mugs/${playerId}.jpg`
const cardImgUrl = playerId =>
  `https://nhl.bamcontent.com/images/headshots/current/168x168/${playerId}.jpg` // playerId removed

const profileImgUrl = playerId =>
  `https://nhl.bamcontent.com/images/actionshots/${playerId}.jpg` // playerId removed

const convertSecsToMMSS = secs => {
  const mins = Math.floor(secs / 60)
  const remaining = secs - 60 * mins
  return `${String(mins).padStart(2, '0')}:${String(remaining).padStart(
    2,
    '0'
  )}`
}

const convertMMSStoSec = time => {
  const [mins, secs] = time.split(':')
  return parseInt(mins * 60) + parseInt(secs)
}

const convertKgToLbs = weight => Math.round(weight * 2.20462262)

const convertCmToFeet = height => {
  let inches = (height * 0.393700787).toFixed(0)
  const feet = Math.floor(inches / 12)
  inches %= 12
  return `${feet}-${inches}`
}

const formatDate = ISODate => {
  return new Date(ISODate).toLocaleDateString(navigator.language, {
    timeZone: 'America/New_York',
  })
}

const getAge = birthDate =>
  Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10) // considers leap year

const formatDateYYYYMMDD = date => {
  const dateObj = new Date(date)
  const year = dateObj.getFullYear().toString()
  const month = (dateObj.getMonth() + 1).toString().padStart(2, 0)
  const days = dateObj
    .getDate()
    .toString()
    .padStart(2, 0)

  return `${year}/${month}/${days}`
}

const showNavItem = (item, token) =>
  (!(item.noToken && token) && !item.tokenRequired) ||
  (item.tokenRequired && token)

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
    to: '/players/top-players',
    name: 'players',
    dropdownName: 'top skaters',
    dropdown: ['players', 'goalies', 'favorites', 'stats'],
  },
  goalies: {
    to: '/players/top-goalies',
    name: 'top goalies',
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
  teams: {
    to: '/teams/top-teams',
    name: 'teams',
    dropdownName: 'top teams',
    dropdown: ['teams', 'standings'],
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
    headerText: 'P/G',
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
    headerText: 'PPT/G',
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
    headerText: 'SHT/G',
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
    headerText: 'T',
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
    headerText: 'T/G',
    id: 'timeOnIcePerGame',
    title: 'Time on Ice per Game',
    sortString: 'TON_PER_GAME',
  },
}

const goalieStatHeaders = {
  assists: {
    headerText: 'A',
    id: 'assists',
    title: 'Assists',
  },
  decision: {
    headerText: 'D',
    id: 'decision',
    showOnMobile: true,
    title: 'Decision',
  },
  gameDate: {
    headerText: 'Date',
    id: 'gameDate',
    showOnMobile: true,
    title: 'Game Date',
  },
  gamesPlayed: {
    headerText: 'GP',
    id: 'gamesPlayed',
    title: 'Games Played',
    sortString: 'GP',
    showOnMobile: true,
  },
  goals: {
    headerText: 'G',
    id: 'goals',
    title: 'Goals',
  },
  goalsAgainst: {
    headerText: 'GA',
    id: 'goalsAgainst',
    showOnMobile: true,
    title: 'Goals Against',
  },
  goalsAgainstAverage: {
    headerText: 'GAA',
    id: 'goalsAgainstAverage',
    showOnMobile: true,
    title: 'Goals Against Average',
  },
  losses: {
    headerText: 'L',
    id: 'losses',
    showOnMobile: true,
    title: 'Losses',
  },
  penaltyMinutes: {
    headerText: 'PM',
    id: 'penaltyMinutes',
    title: 'Penalty Minutes',
  },
  points: {
    headerText: 'P',
    id: 'points',
    title: 'Points',
  },
  powerPlaySavePct: {
    headerText: 'PPS%',
    id: 'powerPlaySavePct',
    title: 'Powerplay Save Percentage',
  },
  powerPlaySaves: {
    headerText: 'PPS',
    id: 'powerPlaySaves',
    title: 'Powerplay Saves',
  },
  powerPlayShotsAgainst: {
    headerText: 'PPSA',
    id: 'powerPlayShotsAgainst',
    title: 'Powerplay Shots Against',
  },
  savePct: {
    headerText: 'S%',
    id: 'savePct',
    showOnMobile: true,
    title: 'Save Percentage',
  },
  saves: {
    headerText: 'Saves',
    id: 'saves',
    showOnMobile: true,
    title: 'Saves',
  },
  savesPerGame: {
    headerText: 'S/G',
    id: 'savesPerGame',
    title: 'Saves per Game',
  },
  shortHandedSavePct: {
    headerText: 'SHS%',
    id: 'shortHandedSavePct',
    title: 'Shorthanded Save Percentage',
  },
  shortHandedSaves: {
    headerText: 'SHS',
    id: 'shortHandedSaves',
    title: 'Shorthanded Saves',
  },
  shortHandedShotsAgainst: {
    headerText: 'SHSA',
    id: 'shortHandedShotsAgainst',
    title: 'Shorthanded Shots Against',
  },
  shotsAgainst: {
    headerText: 'SA',
    id: 'shotsAgainst',
    showOnMobile: true,
    title: 'Shots Against',
  },
  shotsAgainstPerGame: {
    headerText: 'SA/G',
    id: 'shotsAgainstPerGame',
    title: 'Shots Against per Game',
  },
  shutouts: {
    headerText: 'SO',
    id: 'shutouts',
    showOnMobile: true,
    title: 'Shutouts',
  },
  teams: {
    headerText: 'Teams',
    id: 'teams',
    showOnMobile: true,
    title: 'Teams',
  },
  timeOnIce: {
    headerText: 'TON',
    id: 'timeOnIce',
    title: 'Time on Ice',
  },
  winPct: {
    headerText: 'W%',
    id: 'winPct',
    title: 'Win Percentage',
  },
  wins: {
    headerText: 'W',
    id: 'wins',
    showOnMobile: true,
    title: 'Wins',
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
  otLosses: {
    headerText: 'OT',
    id: 'otLosses',
    title: 'Overtime Losses',
    showOnMobile: true,
  },
  otWins: {
    headerText: 'OTW',
    id: 'otWins',
    title: 'Overtime Wins',
  },
  homeRecord: {
    headerText: 'H',
    id: 'homeRecord',
    title: 'Home',
  },
  awayRecord: {
    headerText: 'A',
    id: 'awayRecord',
    title: 'Away',
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
  shootOutWins: {
    headerText: 'SOW',
    id: 'shootOutWins',
    title: 'Shootout Wins',
  },
  goalsForPerGame: {
    headerText: 'GF/G',
    id: 'goalsForPerGame',
    title: 'Goals For per Game',
  },
  goalsAgainstPerGame: {
    headerText: 'GA/G',
    id: 'goalsAgainstPerGame',
    title: 'Goals Against per Game',
  },
  ppPct: {
    headerText: 'PP%',
    id: 'ppPct',
    title: 'Powerplay Percentage',
  },
  powerPlayGoals: {
    headerText: 'PPG',
    id: 'powerPlayGoals',
    title: 'Powerplay Goals',
  },
  pkPct: {
    headerText: 'PK%',
    id: 'pkPct',
    title: 'Penalty Kill Percentage',
  },
  shotsForPerGame: {
    headerText: 'SF/G',
    id: 'shotsForPerGame',
    title: 'Shots For per Game',
  },
  shotsAgainstPerGame: {
    headerText: 'SA/G',
    id: 'shotsAgainstPerGame',
    title: 'Shots Against per Game',
  },
  faceOffWinPct: {
    headerText: 'FOW%',
    id: 'faceOffWinPct',
    title: 'Faceoff Win Percentage',
  },
  takeaways: {
    headerText: 'TA',
    id: 'takeaways',
    title: 'Takeaways',
  },
  giveaways: {
    headerText: 'GA',
    id: 'giveaways',
    title: 'Giveaways',
  },
  hitsForPerGame: {
    headerText: 'HF/G',
    id: 'hitsForPerGame',
    title: 'Hits For Per Game',
  },
  hitsAgainstPerGame: {
    headerText: 'HA/G',
    id: 'hitsAgainstPerGame',
    title: 'Hits Against Per Game',
  },
  powerPlayOpportunitiesAllowed: {
    headerText: 'SHT',
    id: 'powerPlayOpportunitiesAllowed',
    title: 'Shorthanded Times',
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
    key: 'CENTER',
    text: 'Centers',
    value: 'CENTER',
  },
  {
    key: 'LEFT',
    text: 'Left Wings',
    value: 'LEFT',
  },
  {
    key: 'RIGHT',
    text: 'Right Wings',
    value: 'RIGHT',
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

const sortByItems = [
  {
    key: 'POINTS',
    text: 'Points',
    value: 'POINTS',
  },
  {
    key: 'GOALS',
    text: 'Goals',
    value: 'GOALS',
  },
  {
    key: 'ASSISTS',
    text: 'Assists',
    value: 'ASSISTS',
  },
  {
    key: 'PLUSMINUS',
    text: '+/-',
    value: 'PLUSMINUS',
  },
  {
    key: 'PM',
    text: 'Penalty Minutes',
    value: 'PM',
  },
  {
    key: 'PPG',
    text: 'Powerplay Goals',
    value: 'PPG',
  },
  {
    key: 'PPP',
    text: 'Powerplay Points',
    value: 'PPP',
  },
  {
    key: 'SHG',
    text: 'Shorthanded Goals',
    value: 'SHG',
  },
  {
    key: 'SHP',
    text: 'Shorthanded Points',
    value: 'SHP',
  },
  {
    key: 'TON_PER_GAME',
    text: 'TON/G',
    value: 'TON_PER_GAME',
  },
  {
    key: 'FOT',
    text: 'Faceoffs Taken',
    value: 'FOT',
  },
  {
    key: 'SHOTS',
    text: 'Shots',
    value: 'SHOTS',
  },
  {
    key: 'HITS',
    text: 'Hits',
    value: 'HITS',
  },
  {
    key: 'TA',
    text: 'Takeaways',
    value: 'TA',
  },
  {
    key: 'GA',
    text: 'Giveaways',
    value: 'GA',
  },
  {
    key: 'BLOCKED',
    text: 'Blocked shots',
    value: 'BLOCKED',
  },
]

const goalieSortByItems = [
  {
    key: 'WINS',
    text: 'Wins',
    value: 'WINS',
  },
  {
    key: 'LOSSES',
    text: 'Losses',
    value: 'LOSSES',
  },
  {
    key: 'SHUTOUTS',
    text: 'Shutouts',
    value: 'SHUTOUTS',
  },
  {
    key: 'SAVE_PCT',
    text: 'Save-%',
    value: 'SAVE_PCT',
  },
  {
    key: 'GAA',
    text: 'Goals Against Average',
    value: 'GAA',
  },
  {
    key: 'PP_SAVE_PCT',
    text: 'Powerplay Save-%',
    value: 'PP_SAVE_PCT',
  },
  {
    key: 'SH_SAVE_PCT',
    text: 'Shorthanded Save-%',
    value: 'SH_SAVE_PCT',
  },
  {
    key: 'PP_SHOTS_AGAINST',
    text: 'Powerplay Shots Against',
    value: 'PP_SHOTS_AGAINST',
  },
  {
    key: 'SH_SHOTS_AGAINST',
    text: 'Shorthanded Shots Against',
    value: 'SH_SHOTS_AGAINST',
  },
  {
    key: 'SAVES_PER_GAME',
    text: 'Saves per Game',
    value: 'SAVES_PER_GAME',
  },
  {
    key: 'SA_PER_GAME',
    text: 'Shots Against per Game',
    value: 'SA_PER_GAME',
  },
  {
    key: 'WIN_PCT',
    text: 'Win-%',
    value: 'WIN_PCT',
  },
  {
    key: 'PM',
    text: 'Penalty Minutes',
    value: 'PM',
  },
  {
    key: 'GOALS',
    text: 'Goals',
    value: 'GOALS',
  },
  {
    key: 'ASSISTS',
    text: 'Assists',
    value: 'ASSISTS',
  },
]

const teamFilterItems = [
  {
    key: 'ALL',
    text: 'All teams',
    value: 'ALL',
  },
  {
    key: 'E',
    text: 'Eastern Conference',
    value: 'E',
  },
  {
    key: 'W',
    text: 'Western Conference',
    value: 'W',
  },
  {
    key: 'A',
    text: 'Atlantic Division',
    value: 'A',
  },
  {
    key: 'C',
    text: 'Central Division',
    value: 'C',
  },
  {
    key: 'M',
    text: 'Metropolitan Division',
    value: 'M',
  },
  {
    key: 'P',
    text: 'Pacific Division',
    value: 'P',
  },
]

const teamSortByItems = [
  {
    key: 'wins',
    text: 'Wins',
    value: 'wins',
  },
  {
    key: 'losses',
    text: 'Losses',
    value: 'losses',
  },
  {
    key: 'otLosses',
    text: 'OT Losses',
    value: 'otLosses',
  },
  {
    key: 'homeRecord',
    text: 'Home Record',
    value: 'homeRecord',
  },
  {
    key: 'awayRecord',
    text: 'Away Record',
    value: 'awayRecord',
  },
  {
    key: 'goalsFor',
    text: 'Goals For',
    value: 'goalsFor',
  },
  {
    key: 'goalsAgainst',
    text: 'Goals Against',
    value: 'goalsAgainst',
  },
  {
    key: 'powerPlayGoals',
    text: 'Powerplay Goals',
    value: 'powerPlayGoals',
  },
  {
    key: 'ppPct',
    text: 'Powerplay Percentage',
    value: 'ppPct',
  },
  {
    key: 'powerPlayOpportuniesAllowed',
    text: 'Shorthanded Times',
    value: 'powerPlayOpportuniesAllowed',
  },
  {
    key: 'shPct',
    text: 'Shorthanded Percentage',
    value: 'shPct',
  },
  {
    key: 'shotsForPerGame',
    text: 'Shots For Per Game',
    value: 'shotsForPerGame',
  },
  {
    key: 'shotsAgainstPerGame',
    text: 'Shots Against Per Game',
    value: 'shotsAgainstPerGame',
  },
  {
    key: 'takeaways',
    text: 'Takeaways',
    value: 'takeaways',
  },
  {
    key: 'giveaways',
    text: 'Giveaways',
    value: 'giveaways',
  },
  {
    key: 'hitsForPerGame',
    text: 'Hits For Per Game',
    value: 'hitsForPerGame',
  },
  {
    key: 'hitsAgainstPerGame',
    text: 'Hits Against Per Game',
    value: 'hitsAgainstPerGame',
  },
]

const sortByHighlight = {
  POINTS: 'points',
  GOALS: 'goals',
  ASSISTS: 'assists',
  PLUSMINUS: 'plusMinus',
  PM: 'penaltyMinutes',
  PPG: 'powerPlayGoals',
  PPP: 'powerPlayPoints',
  SHG: 'shortHandedGoals',
  SHP: 'shortHandedPoints',
  TON_PER_GAME: 'timeOnIcePerGame',
  FOT: 'faceOffsTaken',
  SHOTS: 'shots',
  HITS: 'hits',
  TA: 'takeaways',
  GA: 'giveaways',
  BLOCKED: 'blocked',
  WINS: 'wins',
  LOSSES: 'losses',
  SHUTOUTS: 'shutouts',
  SAVE_PCT: 'savePct',
  GAA: 'goalsAgainstAverage',
  PP_SAVE_PCT: 'powerPlaySavePct',
  SH_SAVE_PCT: 'shortHandedSavePct',
  PP_SHOTS_AGAINST: 'powerPlayShotsAgainst',
  SH_SHOTS_AGAINST: 'shortHandedShotsAgainst',
  SAVES_PER_GAME: 'savesPerGame',
  SA_PER_GAME: 'shotsAgainstPerGame',
  WIN_PCT: 'winPct',
}

const teamColors = {
  ANA: { primary: '#fc4c02', secondary: '#000', tertiary: '#ba9865' },
  ARI: { primary: '#862633', secondary: '#fff', tertiary: '#ddcba4' },
  BOS: { primary: '#000', secondary: '#ffb81c', tertiary: '#fff' },
  BUF: { primary: '#31364a', secondary: '#eba910', tertiary: '#fff' },
  CAR: { primary: '#000', secondary: '#fff', tertiary: '#bd1f32' },
  CGY: { primary: '#c8102e', secondary: '#000', tertiary: '#f1be48' },
  CHI: { primary: '#bd1f32', secondary: '#fff', tertiary: '#000' },
  CBJ: { primary: '#003366', secondary: '#fff', tertiary: '#ce0e2d' },
  COL: { primary: '#8a2432', secondary: '#fff', tertiary: '#236093' },
  DAL: { primary: '#006341', secondary: '#fff', tertiary: '#000' },
  DET: { primary: '#bd1f32', secondary: '#fff', tertiary: '' },
  EDM: { primary: '#f65e2c', secondary: '#19252e', tertiary: '#fff' },
  FLA: { primary: '#bd1f32', secondary: '#fff', tertiary: '#d08b4e' },
  LAK: { primary: '#000', secondary: '#fff', tertiary: '#959597' },
  MIN: { primary: '#22473f', secondary: '#bec2ab', tertiary: '#8c0b1d' },
  MTL: { primary: '#bd1f32', secondary: '#fff', tertiary: '#293b70' },
  NSH: { primary: '#e9ad3d', secondary: '#17253f', tertiary: '#fff' },
  NJD: { primary: '#bd1f32', secondary: '#fff', tertiary: '#000' },
  NYI: { primary: '#294887', secondary: '#fff', tertiary: '#c83a07' },
  NYR: { primary: '#294887', secondary: '#cf2b3e', tertiary: '#fff' },
  OTT: { primary: '#fff', secondary: '#bd1f32', tertiary: '#000' },
  PHI: { primary: '#ec5d2b', secondary: '#fff', tertiary: '#000' },
  PIT: { primary: '#000', secondary: '#ffb81c', tertiary: '#fff' },
  SJS: { primary: '#127183', secondary: '#fff', tertiary: '#000' },
  STL: { primary: '#194890', secondary: '#fff', tertiary: '#f3b83c' },
  TBL: { primary: '#3a4f86', secondary: '#fff', tertiary: '#000' },
  TOR: { primary: '#00488e', secondary: '#fff', tertiary: '' },
  VAN: { primary: '#00488e', secondary: '#fff', tertiary: '#11875e' },
  VGK: { primary: '#57555a', secondary: '#fff', tertiary: '#d59e55' },
  WPG: { primary: '#2c3248', secondary: '#fff', tertiary: '#205486' },
  WSH: { primary: '#bd1f32', secondary: '#fff', tertiary: '#333e50' },
}

const playerBioHeaders = {
  team: {
    text: '',
  },
  pob: {
    text: 'P.O.B.',
  },
  age: {
    text: 'Age',
  },
  height: {
    text: 'Height',
  },
  weight: {
    text: 'Weight',
  },
  shoots: {
    text: 'Shoots',
  },
  catches: {
    text: 'Catches',
  },
  captain: {
    text: 'Captain',
  },
}

export {
  getCookie,
  removeCookie,
  setCookie,
  cardImgUrl,
  profileImgUrl,
  convertSecsToMMSS,
  convertMMSStoSec,
  convertKgToLbs,
  convertCmToFeet,
  getAge,
  showNavItem,
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
  sortByItems,
  teamColors,
  sortByHighlight,
  formatDate,
  formatDateYYYYMMDD,
  teamFilterItems,
  teamSortByItems,
  goalieSortByItems,
  goalieStatHeaders,
  playerBioHeaders,
}
