import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Loader, Table, Header } from 'semantic-ui-react'
import { CUMULATIVE_STATS } from '../graphql/queries'

const CumulativeStats = () => {
  const { data, loading } = useQuery(CUMULATIVE_STATS)

  if (loading) {
    return <Loader active inline="centered" />
  }

  const headers = [
    'Player',
    'Team',
    'POS',
    'GP',
    'G',
    'A',
    'P',
    '+/-',
    'PM',
    'P/G',
    'GWG',
    'OTG',
    'PPG',
    'PPP',
    'SHG',
    'SHP',
    'Shots',
  ]

  const createHeaders = () => (
    <Table.Row>
      {headers.map(header => (
        <Table.HeaderCell key={header}>{header}</Table.HeaderCell>
      ))}
    </Table.Row>
  )

  const createCells = () =>
    data.GetCumulativeStats.map((player, idx) => (
      <Table.Row key={`${player.playerId}${idx}`}>
        {Object.keys(player)
          .slice(0, -1)
          .map((key, idx) => (
            <Table.Cell key={`${player.playerId}${idx}`}>
              {player[key]}
            </Table.Cell>
          ))}
      </Table.Row>
    ))

  return (
    <div>
      <Header>Stats</Header>
      <Table celled>
        <Table.Header>{createHeaders()}</Table.Header>
        <Table.Body>{createCells()}</Table.Body>
      </Table>
    </div>
  )
}

export default CumulativeStats
