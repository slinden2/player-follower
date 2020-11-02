import React, { useState } from 'react'
import PageContainer from '../elements/PageContainer'
import PlayerViewSelector from './ViewSelector'
import { ShowFiltersButton, FilterContainer } from './styles'
import FramedDropdown from '../elements/dropdown/FramedDropdown'
import TeamCardContainer from './TeamCardContainer'
import {
  teamSortByItems,
  teamFilterItems,
  seasonFilterItems,
} from '../../utils'

const TeamCardPage = () => {
  const [numOfGames, setNumOfGames] = useState(5)
  const [filtersAreVisible, setFiltersAreVisible] = useState(false)
  const [sortBy, setSortBy] = useState('wins')
  const [confFilter, setConfFilter] = useState('ALL')
  const [selectedSeason, setSelectedSeason] = useState('CURRENT')

  const sortDropdownData = {
    items: teamSortByItems,
    state: sortBy,
    setState: setSortBy,
  }
  const filterDropdownData = {
    items: teamFilterItems,
    state: confFilter,
    setState: setConfFilter,
  }

  const seasonData = {
    items: seasonFilterItems,
    state: selectedSeason,
    setState: setSelectedSeason,
  }

  return (
    <PageContainer title='Top Teams'>
      <PlayerViewSelector
        currentView={numOfGames}
        setCurrentView={setNumOfGames}
        numbers={[5, 10, 20]}
        context='TEAM_CARD'
      />
      <ShowFiltersButton
        content={(filtersAreVisible ? 'Hide' : 'Show') + ' Filters'}
        onClick={() => setFiltersAreVisible(!filtersAreVisible)}
      />
      <FilterContainer isVisible={filtersAreVisible}>
        <FramedDropdown title='Season' fields={seasonData} />
        <FramedDropdown title='Sort' fields={sortDropdownData} />
        <FramedDropdown title='Filter' fields={filterDropdownData} />
      </FilterContainer>
      <TeamCardContainer
        numOfGames={numOfGames}
        sortBy={sortBy}
        confFilter={confFilter}
        selectedSeason={selectedSeason}
      />
    </PageContainer>
  )
}

export default TeamCardPage
