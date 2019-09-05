import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { STANDINGS } from '../../graphql/queries'
import StandingsTypeDropdown from './StandingsTypeDropdown'
import _ from 'lodash'
import StatsTable from '../StatsTable'

const Container = styled.div``

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
  const { loading, data } = useQuery(STANDINGS)

  if (loading) {
    return <div>Loading...</div>
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
    <Container>
      <StandingsTypeDropdown setStandingsType={setStandingsType} />
      {Object.keys(standings).map(conference => (
        <StatsTable
          key={conference}
          headers={headers}
          data={cleanStandings[conference]}
          title={conference}
          isTeamStats={true}
        />
      ))}
    </Container>
  )
}

export default Standings
