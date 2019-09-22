import React from 'react'
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

const PlayerCardContainer = ({
  query,
  numOfGames,
  setNumOfGames,
  setFilter,
  header,
}) => {
  if (query.loading) {
    return <Loader offset />
  }

  const createRow = playerResults => {
    if (!playerResults.length) return <div>No results</div>

    return playerResults.map((player, i) => (
      <PlayerCard key={player._id} player={player} i={i + 1} />
    ))
  }

  return (
    <PageContainer title={header}>
      <Container>
        <PlayerViewSelector
          currentView={numOfGames}
          setCurrentView={setNumOfGames}
        />
        <FilterContainer>
          <DropdownMenu items={filterTypes} setState={setFilter} />
        </FilterContainer>
        <CardContainer>{createRow(query.data.BestPlayers)}</CardContainer>
      </Container>
    </PageContainer>
  )
}

export default PlayerCardContainer
