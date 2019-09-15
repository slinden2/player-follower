import React, { useState } from 'react'
import PageContainer from '../../elements/PageContainer'
import PlayerViewSelector from './PlayerViewSelector'
import PlayerCard from './PlayerCard'
import Loader from '../../elements/Loader'
import styled from 'styled-components'
import DropdownMenu from '../../elements/DropdownMenu'

const Container = styled.div``

const FilterContainer = styled.div`
  text-align: center;
`

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 15px;
`

const filterTypes = [
  {
    key: 'ALL',
    text: 'All players',
    value: 'ALL',
  },
  {
    key: 'FORWARD',
    text: 'Forwards',
    value: 'FORWARD',
  },
  {
    key: 'DEFENCE',
    text: 'Defencemen',
    value: 'DEFENCE',
  },
]

const PlayerCardContainer = ({ query, header }) => {
  const [currentView, setCurrentView] = useState('Last game')
  const [filterType, setFilterType] = useState('ALL')

  if (query.loading) {
    return <Loader offset />
  }

  const { oneGame, fiveGames, tenGames } =
    query.data.bestPlayers || query.data.favoritePlayers

  const createRow = playerResults => {
    if (!playerResults.length) return <div>No results</div>

    return playerResults.map((player, i) => (
      <PlayerCard key={player.playerId} player={player} i={i + 1} />
    ))
  }

  const playersToShow =
    currentView === 'Last game'
      ? oneGame
      : currentView === 'Five games'
      ? fiveGames
      : tenGames

  return (
    <PageContainer title={header}>
      <Container>
        <PlayerViewSelector
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        <FilterContainer>
          <DropdownMenu items={filterTypes} setState={setFilterType} />
        </FilterContainer>
        <CardContainer>{createRow(playersToShow)}</CardContainer>
      </Container>
    </PageContainer>
  )
}

export default PlayerCardContainer
