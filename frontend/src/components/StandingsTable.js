import React from 'react'
import { Table, Header } from 'semantic-ui-react'

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

const StandingsTable = ({ standings, title }) => {
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
        {Object.keys(team).map(key => (
          <Table.Cell key={`${key}`}>{team[key]}</Table.Cell>
        ))}
      </Table.Row>
    ))

  // const createCells = () => <tr />

  return (
    <div>
      <Header>{title ? title : 'League'}</Header>
      <Table celled>
        <Table.Header>{createHeaders()}</Table.Header>
        <Table.Body>{createCells()}</Table.Body>
      </Table>
    </div>
  )
}

export default StandingsTable
