import React, { useState, useReducer } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
import { STANDINGS } from '../../graphql/queries'
import _ from 'lodash'
import NewStatsTable from '../stats/NewStatsTable'
import PageContainer from '../elements/PageContainer'
import Loader from '../elements/Loader'
import DropdownMenu from '../elements/dropdown/DropdownMenu'
import sortReducer from '../../reducers/sortReducer'

const headers = [
  'teamName',
  'gamesPlayed',
  'wins',
  'losses',
  'otLosses',
  'points',
  'pointPct',
  'goalsFor',
  'goalsAgainst',
  'otWins',
  'shootOutWins',
  'goalsForPerGame',
  'goalsAgainstPerGame',
  'ppPct',
  'pkPct',
  'shotsForPerGame',
  'shotsAgainstPerGame',
  'faceOffWinPct',
]

const standingsTypes = [
  {
    key: 'LEAGUE',
    text: 'League',
    value: 'LEAGUE',
  },
  {
    key: 'CONFERENCE',
    text: 'Conference',
    value: 'CONFERENCE',
  },
  {
    key: 'DIVISION',
    text: 'Division',
    value: 'DIVISION',
  },
]

const initialSortState = {
  positionFilter: 'ALL', // not in use
  teamFilter: 'ALL', // not in use
  nationalityFilter: 'ALL', // not in use
  offset: 0,
  sortBy: 'points',
  sortDir: 'DESC',
}

// group standings by conference or division
const groupBy = (array, property) => {
  if (property === 'league') return { League: array }
  return _.groupBy(array, team => team[property].name)
}

// clean up league, conference and division objects from the
// standing arrays so that they can be used as react children.
const cleanUpStandings = standings => {
  Object.keys(standings).forEach(conference => {
    standings[conference] = [
      ...standings[conference].map(team => {
        // eslint-disable-next-line
        const { __typename, division, conference, ...teamData } = team
        return teamData
      }),
    ]
  })

  return standings
}

const Standings = () => {
  const [standingsType, setStandingsType] = useState('LEAGUE')
  const [sortVars, dispatch] = useReducer(sortReducer, initialSortState)
  const { loading, data } = useQuery(STANDINGS)

  if (loading) {
    return <Loader offset />
  }

  const sortTeams = teams => {
    const sortedTeams = teams.sort((a, b) => {
      let sort
      sortVars.sortDir === 'DESC'
        ? (sort = b[sortVars.sortBy] - a[sortVars.sortBy])
        : (sort = a[sortVars.sortBy] - b[sortVars.sortBy])
      return sort
    })
    return sortedTeams
  }

  const dataWithLinks = data.Standings.map(team => ({
    ...team,
    teamName: <Link to={`/teams/${team.teamSiteLink}`}>{team.teamName}</Link>,
  }))

  const standings =
    standingsType === 'CONFERENCE'
      ? groupBy(dataWithLinks, 'conference')
      : standingsType === 'DIVISION'
      ? groupBy(dataWithLinks, 'division')
      : groupBy(dataWithLinks, 'league')

  const cleanStandings = cleanUpStandings(standings)

  return (
    <PageContainer title='Standings'>
      <DropdownMenu
        items={standingsTypes}
        state={standingsType}
        setState={setStandingsType}
      />
      {Object.keys(standings).map(conference => (
        <NewStatsTable
          key={conference}
          headers={headers}
          data={sortTeams(cleanStandings[conference])}
          dataType='team'
          title={conference}
          sortVars={sortVars}
          sortDispatch={dispatch}
        />
      ))}
    </PageContainer>
  )
}

export default Standings
