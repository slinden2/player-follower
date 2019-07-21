import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Loader, Table, Header } from 'semantic-ui-react'
import { STANDINGS } from '../graphql/queries'
import StandingsTypeDropdown from './StandingsTypeDropdown'
import _ from 'lodash'
import StandingsTable from './StandingsTable'

// group standings by conference or division
const groupBy = (array, property) => {
  return _.groupBy(array, team => team[property].name)
}

// used to clean up division and conference objects from the
// standing arrays so that they can be used as react children.
const cleanUpLeagueStandings = standings => {
  return [
    ...standings.map(team => {
      const { __typename, division, conference, ...teamData } = team
      return teamData
    }),
  ]
}

// used to clean up division and conference objects from the
// standing arrays so that they can be used as react children.
const cleanUpDivisionStandings = standings => {
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
      : data.Standings

  const cleanStandings =
    standingsType === 'LEAGUE'
      ? cleanUpLeagueStandings(standings)
      : cleanUpDivisionStandings(standings)

  return (
    <div>
      <Header>Standings</Header>
      <StandingsTypeDropdown setStandingsType={setStandingsType} />
      {standingsType === 'LEAGUE' ? (
        <StandingsTable standings={cleanStandings} />
      ) : (
        Object.keys(standings).map(conference => (
          <StandingsTable
            key={conference}
            standings={cleanStandings[conference]}
            title={conference}
          />
        ))
      )}
    </div>
  )
}

export default Standings
