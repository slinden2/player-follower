import React, { useContext } from 'react'
import { useQuery } from 'react-apollo-hooks'
import PageContainer from '../../elements/PageContainer'
import PlayerViewSelector from './PlayerViewSelector'
import styled from 'styled-components'
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
import { LAST_UPDATE } from '../../../graphql/queries'
import breakpoints from '../../../styles/breakpoints'
import colors from '../../../styles/colors'

const Container = styled.div`
  position: relative;
`

const FilterContainer = styled.div`
  @media ${breakpoints.showDesktopNavi} {
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
  top: -43px;
  font-size: 0.75rem;
  text-align: center;
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
        <FilterContainer>
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
