import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import styled from 'styled-components'
import { STANDINGS } from '../../graphql/queries'
import StandingsTypeDropdown from './StandingsTypeDropdown'
import _ from 'lodash'
import StatsTable from '../StatsTable'

const Container = styled.div``

const Header = styled.h3`
  margin: 0;
`

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

  const standings =
    standingsType === 'CONFERENCE'
      ? groupBy(data.Standings, 'conference')
      : standingsType === 'DIVISION'
      ? groupBy(data.Standings, 'division')
      : groupBy(data.Standings, 'league')

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
          teamStats={true}
        />
      ))}
    </Container>
  )
}

export default Standings
