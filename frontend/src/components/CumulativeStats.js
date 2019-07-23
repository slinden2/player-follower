import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Loader, Table, Header, Button } from 'semantic-ui-react'
import { CUMULATIVE_STATS } from '../graphql/queries'

const headers = [
  { headerText: 'Player', prop: 'fullName', sortString: 'PLAYER' },
  { headerText: 'Team', prop: 'team', sortString: 'TEAM' },
  { headerText: 'POS', prop: 'position', sortString: 'POSITION' },
  { headerText: 'GP', prop: 'gamesPlayed', sortString: 'GP' },
  { headerText: 'G', prop: 'goals', sortString: 'GOALS' },
  { headerText: 'A', prop: 'assists', sortString: 'ASSISTS' },
  { headerText: 'P', prop: 'points', sortString: 'POINTS' },
  { headerText: '+/-', prop: 'plusMinus', sortString: 'PLUSMINUS' },
  { headerText: 'PM', prop: 'penaltyMinutes', sortString: 'PM' },
  { headerText: 'P/G', prop: 'pointsPerGame', sortString: 'POINTS_PER_GAME' },
  { headerText: 'GWG', prop: 'gameWinningGoals', sortString: 'GWG' },
  { headerText: 'OTG', prop: 'overTimeGoals', sortString: 'OTG' },
  { headerText: 'PPG', prop: 'powerPlayGoals', sortString: 'PPG' },
  { headerText: 'PPP', prop: 'powerPlayPoints', sortString: 'PPP' },
  { headerText: 'SHG', prop: 'shortHandedGoals', sortString: 'SHG' },
  { headerText: 'SHP', prop: 'shortHandedPoints', sortString: 'SHP' },
  { headerText: 'Shots', prop: 'shots', sortString: 'SHOTS' },
]

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

  const players = data.GetCumulativeStats

  const loadMore = () => {
    fetchMore({
      variables: { offset: players.length },
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
    players.map(player => (
      <Table.Row key={player.fullName}>
        {headers.map(stat => (
          <Table.Cell key={stat.prop}>{player[stat.prop]}</Table.Cell>
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
