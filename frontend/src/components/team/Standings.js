import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
import { STANDINGS } from '../../graphql/queries'
import StandingsTypeDropdown from './StandingsTypeDropdown'
import _ from 'lodash'
import StatsTable from '../stats/StatsTable'
import PageContainer from '../elements/PageContainer'

const headers = [
  'teamName',
  'gamesPlayed',
  'wins',
  'losses',
  'ties',
  'otLosses',
  'points',
  'regPlusOtWins',
  'pointPct',
  'goalsFor',
  'goalsAgainst',
  'shootoutGamesWon',
  'goalsForPerGame',
  'goalsAgainstPerGame',
  'ppPct',
  'pkPct',
  'shotsForPerGame',
  'shotsAgainstPerGame',
  'faceOffWinPct',
]

// group standings by conference or division
const groupBy = (array, property) => {
  if (property === 'league') return { League: array }
  return _.groupBy(array, team => team[property].name)
}

// used to clean up league, conference and division objects from the
// standing arrays so that they can be used as react children.
const cleanUpStandings = standings => {
  Object.keys(standings).forEach(conference => {
    standings[conference] = [
      ...standings[conference].map(team => {
        const { __typename, division, conference, ...teamData } = team
        return teamData
      }),
    ]
  })

  return standings
}

const Standings = () => {
  const [standingsType, setStandingsType] = useState('LEAGUE')
  const [sortVariables, setSortVariables] = useState({
    offset: 0,
    sortBy: 'points',
    sortDir: 'DESC',
  })
  const { loading, data } = useQuery(STANDINGS)

  if (loading) {
    return <div>Loading...</div>
  }

  const sortTeams = teams => {
    const sortedTeams = teams.sort((a, b) => {
      let sort
      sortVariables.sortDir === 'DESC'
        ? (sort = b[sortVariables.sortBy] - a[sortVariables.sortBy])
        : (sort = a[sortVariables.sortBy] - b[sortVariables.sortBy])
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
    <PageContainer title="Standings">
      <StandingsTypeDropdown setStandingsType={setStandingsType} />
      {Object.keys(standings).map(conference => (
        <StatsTable
          key={conference}
          headers={headers}
          data={sortTeams(cleanStandings[conference])}
          title={conference}
          sortVariables={sortVariables}
          setSortVariables={setSortVariables}
          isTeamStats={true}
          sortOnClient={true}
        />
      ))}
    </PageContainer>
  )
}

export default Standings
