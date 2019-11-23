import React, { useReducer } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
import { CUMULATIVE_STATS } from '../../graphql/queries'
import NewStatsTable from '../stats/NewStatsTable'
import Button from '../elements/Button'
import PageContainer from '../elements/PageContainer'
import Loader from '../elements/Loader'
import { playerStatsHeaders } from '../../utils'
import sortReducer from '../../reducers/sortReducer'

const initialSortState = {
  positionFilter: 'ALL', // not in use
  teamFilter: 'ALL', // not in use
  nationalityFilter: 'ALL', // not in use
  offset: 0,
  sortBy: 'POINTS',
  sortDir: 'DESC',
}

const PlayerStats = () => {
  const [sortVars, dispatch] = useReducer(sortReducer, initialSortState)
  const { data, loading, fetchMore } = useQuery(CUMULATIVE_STATS, {
    variables: sortVars,
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
    <PageContainer title='Player Stats'>
      <NewStatsTable
        headers={playerStatsHeaders}
        data={playersWithLink}
        dataType='skater'
        sortVars={sortVars}
        sortDispatch={dispatch}
        apiSort={true}
      />
      <Button
        onClick={loadMore}
        content='Load More'
        size='medium'
        style={{ marginTop: '10px' }}
      />
    </PageContainer>
  )
}

export default PlayerStats
