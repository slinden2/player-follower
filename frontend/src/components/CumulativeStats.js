import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
import { Loader, Button } from 'semantic-ui-react'
import { CUMULATIVE_STATS } from '../graphql/queries'
import StatsTable from './StatsTable'

const headers = [
  { headerText: 'Player', id: 'fullName', sortString: 'PLAYER' },
  { headerText: 'Team', id: 'team', sortString: 'TEAM' },
  { headerText: 'POS', id: 'position', sortString: 'POSITION' },
  { headerText: 'GP', id: 'gamesPlayed', sortString: 'GP' },
  { headerText: 'G', id: 'goals', sortString: 'GOALS' },
  { headerText: 'A', id: 'assists', sortString: 'ASSISTS' },
  { headerText: 'P', id: 'points', sortString: 'POINTS' },
  { headerText: '+/-', id: 'plusMinus', sortString: 'PLUSMINUS' },
  { headerText: 'PM', id: 'penaltyMinutes', sortString: 'PM' },
  { headerText: 'P/G', id: 'pointsPerGame', sortString: 'POINTS_PER_GAME' },
  { headerText: 'GWG', id: 'gameWinningGoals', sortString: 'GWG' },
  { headerText: 'OTG', id: 'overTimeGoals', sortString: 'OTG' },
  { headerText: 'PPG', id: 'powerPlayGoals', sortString: 'PPG' },
  { headerText: 'PPP', id: 'powerPlayPoints', sortString: 'PPP' },
  { headerText: 'SHG', id: 'shortHandedGoals', sortString: 'SHG' },
  { headerText: 'SHP', id: 'shortHandedPoints', sortString: 'SHP' },
  { headerText: 'Shots', id: 'shots', sortString: 'SHOTS' },
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
