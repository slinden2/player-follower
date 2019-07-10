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

  return (
    <div>
      <Header>Stats</Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            {headers.map(header => (
              <Table.HeaderCell key={header}>{header}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.cumulativeStats.map(player => (
            <Table.Row key={player.playerId}>
              <Table.Cell>{`${player.playerFirstName} ${
                player.playerLastName
              }`}</Table.Cell>
              {Object.keys(player)
                .slice(3, -1)
                .map(key => (
                  <Table.Cell key={parseInt(player.playerId) + key}>
                    {player[key]}
                  </Table.Cell>
                ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default CumulativeStats
