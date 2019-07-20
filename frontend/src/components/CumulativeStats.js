import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Loader, Table, Header, Button } from 'semantic-ui-react'
import { CUMULATIVE_STATS } from '../graphql/queries'

const CumulativeStats = () => {
  const [variables, setVariables] = useState({
    offset: 0,
    sortBy: 'POINTS',
    sortDir: 'DESC',
  })
  const { data, loading, fetchMore } = useQuery(CUMULATIVE_STATS, {
    variables,
  })

  if (loading) {
    return <Loader active inline="centered" />
  }

  const headers = [
    { headerText: 'Player', sortString: 'PLAYER' },
    { headerText: 'Team', sortString: 'TEAM' },
    { headerText: 'POS', sortString: 'POSITION' },
    { headerText: 'GP', sortString: 'GP' },
    { headerText: 'G', sortString: 'GOALS' },
    { headerText: 'A', sortString: 'ASSISTS' },
    { headerText: 'P', sortString: 'POINTS' },
    { headerText: '+/-', sortString: 'PLUSMINUS' },
    { headerText: 'PM', sortString: 'PM' },
    { headerText: 'P/G', sortString: 'POINT_PER_GAME' },
    { headerText: 'GWG', sortString: 'GWG' },
    { headerText: 'OTG', sortString: 'OTG' },
    { headerText: 'PPG', sortString: 'PPG' },
    { headerText: 'PPP', sortString: 'PPP' },
    { headerText: 'SHG', sortString: 'SHG' },
    { headerText: 'SHP', sortString: 'SHP' },
    { headerText: 'Shots', sortString: 'SHOTS' },
  ]

  const loadMore = () => {
    fetchMore({
      variables: { offset: data.GetCumulativeStats.length },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult
        return {
          ...prevResult,
          GetCumulativeStats: [
            ...prevResult.GetCumulativeStats,
            ...fetchMoreResult.GetCumulativeStats,
          ],
        }
      },
    })
  }

  const handleNewVariables = sortBy => {
    // cant sort by these fields atm because of
    // how aggregation is done in the backend
    if (sortBy === 'PLAYER' || sortBy === 'TEAM' || sortBy === 'POSITION')
      return

    if (sortBy === variables.sortBy) {
      variables.sortDir === 'DESC'
        ? setVariables({ offset: 0, sortBy, sortDir: 'ASC' })
        : setVariables({ offset: 0, sortBy, sortDir: 'DESC' })
    } else {
      setVariables({ offset: 0, sortBy, sortDir: 'DESC' })
    }
  }

  const createHeaders = () => (
    <Table.Row>
      {headers.map(header => (
        <Table.HeaderCell
          key={header.headerText}
          onClick={() => handleNewVariables(header.sortString)}
        >
          {header.headerText}
        </Table.HeaderCell>
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
      <Button onClick={loadMore}>Load more</Button>
    </div>
  )
}

export default CumulativeStats
