import React, { useState, useReducer } from 'react'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { STANDINGS } from '../../graphql/queries'
import _ from 'lodash'
import NewStatsTable from '../stats/NewStatsTable'
import PageContainer from '../elements/PageContainer'
import Loader from '../elements/Loader'
import sortReducer from '../../reducers/sortReducer'
import { standingsTableOrder } from '../../utils'
import { FilterContainer } from '../card/styles'
import FramedDropdown from '../elements/dropdown/FramedDropdown'
import { seasonFilterItems } from '../../utils'

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

// Sorts stat tables by division or conference.
// Eastern before western, Metropolitan before Central etc...
const sortConfs = (key1, key2) => {
  const index1 = standingsTableOrder.indexOf(key1)
  const index2 = standingsTableOrder.indexOf(key2)
  return index1 > index2 ? 1 : -1
}

const Standings = () => {
  const [standingsType, setStandingsType] = useState('LEAGUE')
  const [sortVars, dispatch] = useReducer(sortReducer, initialSortState)
  const [selectedSeason, setSelectedSeason] = useState('CURRENT')
  const { loading, data } = useQuery(STANDINGS, {
    variables: { selectedSeason },
  })

  if (loading) {
    return <Loader offset />
  }

  const seasonData = {
    items: seasonFilterItems,
    state: selectedSeason,
    setState: setSelectedSeason,
  }

  const leagueGroupData = {
    items: standingsTypes,
    state: standingsType,
    setState: setStandingsType,
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
      <FilterContainer>
        <FramedDropdown title='Season' fields={seasonData} />
        <FramedDropdown title='Grouped by' fields={leagueGroupData} />
      </FilterContainer>
      {Object.keys(standings)
        .sort((key1, key2) => sortConfs(key1, key2))
        .map(conference => (
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
