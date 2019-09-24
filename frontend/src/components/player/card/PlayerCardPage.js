import React, { useContext } from 'react'
import PageContainer from '../../elements/PageContainer'
import PlayerViewSelector from './PlayerViewSelector'
import styled from 'styled-components'
import DropdownMenu from '../../elements/DropdownMenu'
import { PlayerContext } from '../../../contexts/PlayerContext'
import { playerPosFilterItems, playerTeamFilterItems } from '../../../utils'
import PlayerCardContainer from './PlayerCardContainer'

const Container = styled.div``

const FilterContainer = styled.div`
  text-align: center;
`

const PlayerCardPage = ({ queryName, header }) => {
  const {
    numOfGames,
    setNumOfGames,
    positionFilter,
    setPositionFilter,
    teamFilter,
    setTeamFilter,
  } = useContext(PlayerContext)

  return (
    <PageContainer title={header}>
      <Container>
        <PlayerViewSelector
          currentView={numOfGames}
          setCurrentView={setNumOfGames}
        />
        <FilterContainer>
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
        </FilterContainer>
        <PlayerCardContainer queryName={queryName} />
      </Container>
    </PageContainer>
  )
}

export default PlayerCardPage
