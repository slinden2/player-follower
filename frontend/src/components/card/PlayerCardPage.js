import React, { useContext, useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import styled from 'styled-components'
import PageContainer from '../elements/PageContainer'
import PlayerViewSelector from './ViewSelector'
import { PlayerContext } from '../../contexts/PlayerContext'
import {
  playerPosFilterItems,
  playerTeamFilterItems,
  playerNationalityFilterItems,
  sortByItems,
} from '../../utils'
import PlayerCardContainer from './PlayerCardContainer'
import Loader from '../elements/Loader'
import { ShowFiltersButton, FilterContainer } from './styles'
import { LAST_UPDATE } from '../../graphql/queries'
import FramedDropdown from '../elements/dropdown/FramedDropdown'

const Container = styled.div`
  position: relative;
`

const LastUpdated = styled.div`
  position: absolute;
  right: 10px;
  top: -60px;
  font-size: 0.875rem;
  text-align: center;

  @media (max-width: 500px) {
    display: none;
  }
`

const formatDate = UTCIsoString => {
  const UTCDate = new Date(UTCIsoString)

  const options = {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }

  return UTCDate.toLocaleDateString(navigator.language, options)
}

const PlayerCardPage = ({ queryName, header }) => {
  const {
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
  } = useContext(PlayerContext)
  const { data, loading } = useQuery(LAST_UPDATE)
  const [filtersAreVisible, setFiltersAreVisible] = useState(false)

  if (loading) {
    return <Loader offset />
  }

  const date = formatDate(data.GetLastUpdate.date)

  const sortDropdownData = {
    items: sortByItems,
    state: sortBy,
    setState: setSortBy,
  }
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

  return (
    <PageContainer title={header}>
      <Container>
        <LastUpdated>
          Last update
          <br />
          {date}
        </LastUpdated>
        <PlayerViewSelector
          currentView={numOfGames}
          setCurrentView={setNumOfGames}
          numbers={[1, 5, 10]}
          context='PLAYER_CARD'
        />
        <ShowFiltersButton
          content={(filtersAreVisible ? 'Hide' : 'Show') + ' Filters'}
          onClick={() => setFiltersAreVisible(!filtersAreVisible)}
        />
        <FilterContainer isVisible={filtersAreVisible}>
          <FramedDropdown title='Sort' fields={sortDropdownData} />
          <FramedDropdown title='Filter' fields={filterDropdownData} />
        </FilterContainer>
        <PlayerCardContainer queryName={queryName} />
      </Container>
    </PageContainer>
  )
}

export default PlayerCardPage
