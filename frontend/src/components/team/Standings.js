import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Loader, Header } from 'semantic-ui-react'
import { STANDINGS } from '../../graphql/queries'
import StandingsTypeDropdown from './StandingsTypeDropdown'
import _ from 'lodash'
import StatsTable from '../StatsTable'

const headers = [
  { headerText: 'Team', id: 'teamName' },
  { headerText: 'GP', id: 'gamesPlayed' },
  { headerText: 'W', id: 'wins' },
  { headerText: 'L', id: 'losses' },
  { headerText: 'T', id: 'ties' },
  { headerText: 'OT', id: 'otLosses' },
  { headerText: 'P', id: 'points' },
  { headerText: 'ROW', id: 'regPlusOtWins' },
  { headerText: 'P%', id: 'pointPct' },
  { headerText: 'GF', id: 'goalsFor' },
  { headerText: 'GA', id: 'goalsAgainst' },
  { headerText: 'S/O Wins', id: 'shootoutGamesWon' },
  { headerText: 'GF/GP', id: 'goalsForPerGame' },
  { headerText: 'GA/GP', id: 'goalsAgainstPerGame' },
  { headerText: 'PP%', id: 'ppPct' },
  { headerText: 'PK%', id: 'pkPct' },
  { headerText: 'Shots/GP', id: 'shotsForPerGame' },
  { headerText: 'SA/GP', id: 'shotsAgainstPerGame' },
  { headerText: 'FOW%', id: 'faceOffWinPct' },
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
    return <Loader active inline="centered" />
  }

  const standings =
    standingsType === 'CONFERENCE'
      ? groupBy(data.Standings, 'conference')
      : standingsType === 'DIVISION'
      ? groupBy(data.Standings, 'division')
      : groupBy(data.Standings, 'league')

  const cleanStandings = cleanUpStandings(standings)

  return (
    <div>
      <Header>Standings</Header>
      <StandingsTypeDropdown setStandingsType={setStandingsType} />
      {Object.keys(standings).map(conference => (
        <StatsTable
          key={conference}
          headers={headers}
          data={cleanStandings[conference]}
          title={conference}
        />
      ))}
    </div>
  )
}

export default Standings
