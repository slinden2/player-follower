import React from 'react'
import { Table, Header } from 'semantic-ui-react'

const headers = [
  { headerText: 'Team', prop: 'teamName' },
  { headerText: 'GP', prop: 'gamesPlayed' },
  { headerText: 'W', prop: 'wins' },
  { headerText: 'L', prop: 'losses' },
  { headerText: 'T', prop: 'ties' },
  { headerText: 'OT', prop: 'otLosses' },
  { headerText: 'P', prop: 'points' },
  { headerText: 'ROW', prop: 'regPlusOtWins' },
  { headerText: 'P%', prop: 'pointPct' },
  { headerText: 'GF', prop: 'goalsFor' },
  { headerText: 'GA', prop: 'goalsAgainst' },
  { headerText: 'S/O Wins', prop: 'shootoutGamesWon' },
  { headerText: 'GF/GP', prop: 'goalsForPerGame' },
  { headerText: 'GA/GP', prop: 'goalsAgainstPerGame' },
  { headerText: 'PP%', prop: 'ppPct' },
  { headerText: 'PK%', prop: 'pkPct' },
  { headerText: 'Shots/GP', prop: 'shotsForPerGame' },
  { headerText: 'SA/GP', prop: 'shotsAgainstPerGame' },
  { headerText: 'FOW%', prop: 'faceOffWinPct' },
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
        {headers.map(stat => (
          <Table.Cell key={stat.prop}>{team[stat.prop]}</Table.Cell>
        ))}
      </Table.Row>
    ))

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
