import React, { useContext, useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import styled, { css } from 'styled-components'
import PageContainer from '../../elements/PageContainer'
import PlayerViewSelector from './PlayerViewSelector'
import DropdownMenu from '../../elements/DropdownMenu'
import { PlayerContext } from '../../../contexts/PlayerContext'
import {
  playerPosFilterItems,
  playerTeamFilterItems,
  playerNationalityFilterItems,
  sortByItems,
} from '../../../utils'
import PlayerCardContainer from './PlayerCardContainer'
import Loader from '../../elements/Loader'
import Button from '../../elements/Button'
import { LAST_UPDATE } from '../../../graphql/queries'
import breakpoints from '../../../styles/breakpoints'
import colors from '../../../styles/colors'

const Container = styled.div`
  position: relative;
`

const ShowFiltersButton = styled(Button)`
  font-size: 0.75rem;
  padding: 5px;
  margin: 10px auto;
  display: block;

  @media ${breakpoints.showDesktopNavi} {
    display: none;
  }
`

const FilterContainer = styled.div`
  height: auto;
  max-height: 200px;
  ${({ isVisible }) =>
    !isVisible &&
    css`
      transition: max-height 250ms ease-in-out 150ms, opacity 150ms ease-in-out,
        transform 150ms ease-in-out;
      max-height: 0;
      opacity: 0;
      transform: translateX(-100%);
    `};

  ${({ isVisible }) =>
    isVisible &&
    css`
      transition: max-height 100ms ease-in, opacity 250ms ease-in-out 250ms,
        transform 250ms ease-in-out 150ms;
      max-height: 500px;
      opacity: 1;
      transform: translateX(0);
    `};

  @media ${breakpoints.showDesktopNavi} {
    max-height: 200px;
    transform: none;
    opacity: 1;
    display: flex;
    justify-content: center;
  }
`

const FieldContainer = styled.fieldset`
  font-size: 0.875rem;
  border: 2px solid ${colors.grey1};
  border-radius: 10px;
  margin: 5px;
`

const FieldsetTitle = styled.legend`
  border: 2px solid ${colors.grey1};
  border-radius: 10px;
  background-color: ${colors.grey1};
  padding: 5px;
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
        />
        <ShowFiltersButton
          content={(filtersAreVisible ? 'Hide' : 'Show') + ' Filters'}
          onClick={() => setFiltersAreVisible(!filtersAreVisible)}
        />
        <FilterContainer isVisible={filtersAreVisible}>
          <FieldContainer>
            <FieldsetTitle>Sort</FieldsetTitle>
            <DropdownMenu
              items={sortByItems}
              state={sortBy}
              setState={setSortBy}
            />
          </FieldContainer>
          <FieldContainer>
            <FieldsetTitle>Filters</FieldsetTitle>
            <DropdownMenu
              items={playerPosFilterItems}
              state={positionFilter}
              setState={setPositionFilter}
            />
            <DropdownMenu
              items={playerTeamFilterItems}
              state={teamFilter}
              setState={setTeamFilter}
            />
            <DropdownMenu
              items={playerNationalityFilterItems}
              state={nationalityFilter}
              setState={setNationalityFilter}
            />
          </FieldContainer>
        </FilterContainer>
        <PlayerCardContainer queryName={queryName} />
      </Container>
    </PageContainer>
  )
}

export default PlayerCardPage
