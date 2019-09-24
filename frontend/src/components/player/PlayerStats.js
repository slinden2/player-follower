import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
import { CUMULATIVE_STATS } from '../../graphql/queries'
import StatsTable from '../stats/StatsTable'
import Button from '../elements/Button'
import PageContainer from '../elements/PageContainer'
import Loader from '../elements/Loader'

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
  'powerPlayGoals',
  'powerPlayPoints',
  'shortHandedGoals',
  'shortHandedPoints',
  'shots',
  'shotPct',
  'faceOffPct',
  'takeaways',
  'giveaways',
  'blocked',
  'timeOnIcePerGame',
  'shortHandedTimeOnIcePerGame',
  'powerPlayTimeOnIcePerGame',
]

const PlayerStats = () => {
  const [variables, setVariables] = useState({
    positionFilter: 'ALL', // not in use
    teamFilter: 'ALL', // not in use
    offset: 0,
    sortBy: 'POINTS',
    sortDir: 'DESC',
  })
  const { data, loading, fetchMore } = useQuery(CUMULATIVE_STATS, {
    variables,
  })

  if (loading) {
    return <Loader offset />
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
    team: <Link to={`/teams/${player.teamSiteLink}`}>{player.team}</Link>,
  }))

  return (
    <PageContainer title="Player Stats">
      <StatsTable
        headers={headers}
        stats="Stats"
        data={playersWithLink}
        sortVariables={variables}
        setSortVariables={setVariables}
      />
      <Button onClick={loadMore} content="Load more" />
    </PageContainer>
  )
}

export default PlayerStats
