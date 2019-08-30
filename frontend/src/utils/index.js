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

const setCookie = (name, value) => {
  document.cookie = `${name}=${value}`
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
    title: 'Team',
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
    to: '/stats',
    name: 'stats',
  },
  standings: {
    to: '/standings',
    name: 'standings',
  },
  about: {
    to: '/about',
    name: 'about',
  },
  search: {
    to: '/find-players',
    name: 'search',
    hideOnWide: true,
  },
  login: {
    to: '/login',
    name: 'login',
    noToken: true,
  },
  signup: {
    to: '/signup',
    name: 'sign up',
    noToken: true,
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
  blocks: {
    headerText: 'Blocks',
    id: 'blocks',
    title: 'Blocks',
  },
  blocked: {
    headerText: 'Blocks',
    id: 'blocked',
    title: 'Blocks',
  },
  faceOffsTaken: {
    headerText: 'FOT',
    id: 'faceOffsTaken',
    title: 'Faceoffs Taken',
  },
  fullName: {
    headerText: 'Player',
    id: 'fullName',
    title: 'Full Name',
    sortString: 'PLAYER',
    showOnMobile: true,
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
  },
  gameWinningGoals: {
    headerText: 'GWG',
    id: 'gameWinningGoals',
    title: 'Game Winning Goals',
    sortString: 'GWG',
  },
  giveaways: {
    headerText: 'GA',
    id: 'giveaways',
    title: 'Giveaways',
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
  },
  overTimeGoals: {
    headerText: 'OTG',
    id: 'overTimeGoals',
    title: 'Overtime Goals',
    sortString: 'OTG',
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
  shotPct: {
    headerText: 'S%',
    id: 'shotPct',
    title: 'Shot Percentage',
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
  },
}

export {
  getCookie,
  removeCookie,
  setCookie,
  cardImgUrl,
  profileImgUrl,
  convertSecsToMMSS,
  naviItems,
  statHeaders,
  playerBioData,
}
