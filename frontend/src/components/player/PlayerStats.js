import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CUMULATIVE_STATS } from '../../graphql/queries'
import StatsTable from '../StatsTable'
import Button from '../elements/Button'

const Container = styled.div`
  width: 100%;
`

const headers = [
  'fullName',
  'team',
  'position',
  'gamesPlayed',
  'goals',
  'assists',
  'points',
  'plusMinus',
  'penaltyMinutes',
  'pointsPerGame',
  'gameWinningGoals',
  'overTimeGoals',
  'powerPlayGoals',
  'powerPlayPoints',
  'shortHandedGoals',
  'shortHandedPoints',
  'shots',
]

const PlayerStats = () => {
  const [variables, setVariables] = useState({
    offset: 0,
    sortBy: 'POINTS',
    sortDir: 'DESC',
  })
  const { data, loading, fetchMore } = useQuery(CUMULATIVE_STATS, {
    variables,
  })

  if (loading) {
    return <div>Loading...</div>
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

  const playersWithLink = players.map(player => ({
    ...player,
    fullName: <Link to={`/players/${player.siteLink}`}>{player.fullName}</Link>,
  }))

  return (
    <Container>
      <StatsTable
        headers={headers}
        stats="Stats"
        data={playersWithLink}
        sortVariables={variables}
        setSortVariables={setVariables}
      />
      <Button onClick={loadMore} content="Load more" />
    </Container>
  )
}

export default PlayerStats
