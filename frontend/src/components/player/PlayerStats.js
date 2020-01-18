import React, { useReducer, useState, useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
import { CUMULATIVE_STATS } from '../../graphql/queries'
import NewStatsTable from '../stats/NewStatsTable'
import Button from '../elements/Button'
import PageContainer from '../elements/PageContainer'
import Loader from '../elements/Loader'
import {
  playerStatsHeaders,
  playerPosFilterItems,
  playerTeamFilterItems,
  playerNationalityFilterItems,
} from '../../utils'
import sortReducer from '../../reducers/sortReducer'
import FramedDropdown from '../elements/dropdown/FramedDropdown'
import { FilterContainer, ShowFiltersButton } from '../card/styles'

const initialSortState = {
  positionFilter: 'ALL',
  teamFilter: 'ALL',
  nationalityFilter: 'ALL',
  offset: 0,
  sortBy: 'POINTS',
  sortDir: 'DESC',
}

const PlayerStats = () => {
  const [sortVars, dispatch] = useReducer(sortReducer, initialSortState)
  const { data, loading, fetchMore } = useQuery(CUMULATIVE_STATS, {
    variables: sortVars,
  })
  const [filtersAreVisible, setFiltersAreVisible] = useState(false)
  const [positionFilter, setPositionFilter] = useState('ALL')
  const [teamFilter, setTeamFilter] = useState('ALL')
  const [nationalityFilter, setNationalityFilter] = useState('ALL')

  useEffect(() => {
    dispatch({
      type: 'FILTER_CHANGE',
      data: { positionFilter, teamFilter, nationalityFilter },
    })
  }, [positionFilter, teamFilter, nationalityFilter])

  if (loading) {
    return <Loader offset />
  }

  const players = data.GetCumulativeStats

  const filterDropdownData = [
    {
      items: playerPosFilterItems,
      state: positionFilter,
      setState: setPositionFilter,
    },
    {
      items: playerTeamFilterItems,
      state: teamFilter,
      setState: setTeamFilter,
    },
    {
      items: playerNationalityFilterItems,
      state: nationalityFilter,
      setState: setNationalityFilter,
    },
  ]

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
      <ShowFiltersButton
        content={(filtersAreVisible ? 'Hide' : 'Show') + ' Filters'}
        onClick={() => setFiltersAreVisible(!filtersAreVisible)}
      />
      <FilterContainer isVisible={filtersAreVisible}>
        <FramedDropdown title='Filter' fields={filterDropdownData} />
      </FilterContainer>
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
