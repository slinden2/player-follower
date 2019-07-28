import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
import { Loader, Button } from 'semantic-ui-react'
import { CUMULATIVE_STATS } from '../graphql/queries'
import StatsTable from './StatsTable'

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

  const playersWithLink = players.map(player => ({
    ...player,
    fullName: <Link to={`players/${player.siteLink}`}>{player.fullName}</Link>,
  }))

  return (
    <div>
      <StatsTable
        headers={headers}
        stats={'Stats'}
        data={playersWithLink}
        sortVariables={variables}
        setSortVariables={setVariables}
      />
      <Button onClick={loadMore}>Load more</Button>
    </div>
  )
}

export default CumulativeStats
