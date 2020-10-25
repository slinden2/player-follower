import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import PageContainer from '../elements/PageContainer'
import PlayerViewSelector from './ViewSelector'
import { PlayerContext } from '../../contexts/PlayerContext'
import {
  playerPosFilterItems,
  playerTeamFilterItems,
  playerNationalityFilterItems,
  sortByItems,
  goalieSortByItems,
  seasonFilterItems,
} from '../../utils'
import PlayerCardContainer from './PlayerCardContainer'
import { ShowFiltersButton, FilterContainer } from './styles'
import FramedDropdown from '../elements/dropdown/FramedDropdown'

const Container = styled.div`
  position: relative;
`

const PlayerCardPage = ({ context, queryName, header }) => {
  const {
    bestPlayers,
    bestGoalies,
    favoritePlayers,
    numOfGames,
    setNumOfGames,
    positionFilter,
    setPositionFilter,
    teamFilter,
    setTeamFilter,
    nationalityFilter,
    setNationalityFilter,
    sortBy,
    setSortBy,
    goalieSortBy,
    setGoalieSortBy,
    resetFilters,
    filterContext,
    setFilterContext,
    selectedSeason,
    setSelectedSeason,
  } = useContext(PlayerContext)
  const [filtersAreVisible, setFiltersAreVisible] = useState(false)

  useEffect(() => {
    if (context !== filterContext) {
      setFilterContext(context)
      resetFilters()
    }

    return () => {
      resetFilters()
    }
  }, [context]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const seasonData = {
    items: seasonFilterItems,
    state: selectedSeason,
    setState: setSelectedSeason,
  }

  const contextSelector = {
    player: () => ({
      filterArray: filterDropdownData,
      sortData: {
        items: sortByItems,
        state: sortBy,
        setState: setSortBy,
      },
      query: queryName === 'FavoritePlayers' ? favoritePlayers : bestPlayers,
      queryName,
      seasonData,
    }),
    goalie: () => ({
      filterArray: filterDropdownData.slice(1),
      sortData: {
        items: goalieSortByItems,
        state: goalieSortBy,
        setState: setGoalieSortBy,
      },
      query: bestGoalies,
      queryName,
      seasonData,
    }),
  }

  const curContext = contextSelector[context]()

  return (
    <PageContainer title={header}>
      <Container>
        <PlayerViewSelector
          currentView={numOfGames}
          setCurrentView={setNumOfGames}
          numbers={[1, 5, 10]}
          context='PLAYER_CARD'
        />
        <ShowFiltersButton
          content={(filtersAreVisible ? 'Hide' : 'Show') + ' Filters'}
          onClick={() => setFiltersAreVisible(!filtersAreVisible)}
          dataCy='filter-button'
        />
        <FilterContainer
          isVisible={filtersAreVisible}
          data-cy='filter-container'
        >
          <FramedDropdown title='Season' fields={curContext.seasonData} />
          <FramedDropdown title='Sort' fields={curContext.sortData} />
          <FramedDropdown title='Filter' fields={curContext.filterArray} />
        </FilterContainer>
        <PlayerCardContainer
          query={curContext.query}
          queryName={curContext.queryName}
        />
      </Container>
    </PageContainer>
  )
}

export default PlayerCardPage
