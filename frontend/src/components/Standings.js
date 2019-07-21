import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Loader, Table, Header } from 'semantic-ui-react'
import { STANDINGS } from '../graphql/queries'
import StandingsTypeDropdown from './StandingsTypeDropdown'
import _ from 'lodash'

const groupBy = (array, property) => {
  return _.groupBy(array, team => team[property].name)
}

const Standings = () => {
  const [standingsType, setStandingsType] = useState('LEAGUE')
  const { loading, data } = useQuery(STANDINGS)

  if (loading) {
    return <Loader active inline="centered" />
  }

  const cleanStandings = [
    ...data.Standings.map(team => {
      const { __typename, division, conference, ...teamData } = team
      return teamData
    }),
  ]

  const standings =
    standingsType === 'CONFERENCE'
      ? groupBy(data.Standings, 'conference')
      : standingsType === 'DIVISION'
      ? groupBy(data.Standings, 'division')
      : cleanStandings

  const headers = [
    { headerText: 'Team', sortString: 'teamName' },
    { headerText: 'GP', sortString: 'gamesPlayed' },
    { headerText: 'W', sortString: 'wins' },
    { headerText: 'L', sortString: 'losses' },
    { headerText: 'T', sortString: 'ties' },
    { headerText: 'OT', sortString: 'otLosses' },
    { headerText: 'P', sortString: 'points' },
    { headerText: 'ROW', sortString: 'regPlusOtWins' },
    { headerText: 'P%', sortString: 'pointPct' },
    { headerText: 'GF', sortString: 'goalsFor' },
    { headerText: 'GA', sortString: 'goalsAgainst' },
    { headerText: 'S/O Wins', sortString: 'shootoutGamesWon' },
    { headerText: 'GF/GP', sortString: 'goalsForPerGame' },
    { headerText: 'GA/GP', sortString: 'goalsAgainsPerGame' },
    { headerText: 'PP%', sortString: 'ppPct' },
    { headerText: 'PK%', sortString: 'pkPct' },
    { headerText: 'Shots/GP', sortString: 'shotsForPerGame' },
    { headerText: 'SA/GP', sortString: 'shotsAgainstPerGame' },
    { headerText: 'FOW%', sortString: 'faceOffWinPct' },
  ]

  const createHeaders = () => (
    <Table.Row>
      {headers.map(header => (
        <Table.HeaderCell key={header.headerText}>
          {header.headerText}
        </Table.HeaderCell>
      ))}
    </Table.Row>
  )

  const createCells = () =>
    standings.map(team => (
      <Table.Row key={team.teamName}>
        {Object.keys(team)
          // .slice(0, -3)
          .map(key => (
            <Table.Cell key={`${key}`}>{team[key]}</Table.Cell>
          ))}
      </Table.Row>
    ))

  return (
    <div>
      <Header>Standings</Header>
      <StandingsTypeDropdown setStandingsType={setStandingsType} />
      <Table celled>
        <Table.Header>{createHeaders()}</Table.Header>
        <Table.Body>{createCells()}</Table.Body>
      </Table>
    </div>
  )
}

export default Standings
