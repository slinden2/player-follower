import React, { useState } from 'react'
import { event } from '../../../utils/tracking'
import PageContainer from '../../elements/PageContainer'
import PlayerCard from './PlayerCard'
import Loader from '../../elements/Loader'
import styled from 'styled-components'
import colors from '../../../styles/colors'

const Container = styled.div`
  .view-selector {
    text-align: center;
    margin: 5px auto;

    & span {
      padding: 0 10px;
      border-right: 2px solid ${colors.grey4};
      font-size: 5vw;
      @media (min-width: 470px) {
        font-size: 1.5rem;
      }
      &:hover {
        font-weight: bolder;
      }
    }

    & span:last-child {
      border-right: 0px;
    }
  }

  .card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: 15px;
  }
`

const ViewSelectorItem = styled.span`
  cursor: pointer;
  ${props => props.selected && 'font-weight: bold'};
`

const PlayerCardContainer = ({ query, header }) => {
  const [currentView, setCurrentView] = useState('Last game')

  if (query.loading) {
    return <Loader offset />
  }

  const handleViewChange = view => {
    setCurrentView(view)
    event('PLAYER_CARD', 'Card view changed', view)
  }

  const { oneGame, fiveGames, tenGames } =
    query.data.bestPlayers || query.data.favoritePlayers

  const createRow = playerResults => {
    if (!playerResults.length) return <div>No results</div>

    return playerResults.map(player => (
      <PlayerCard key={player.playerId} player={player} />
    ))
  }

  const playersToShow =
    currentView === 'Last game'
      ? oneGame
      : currentView === 'Five games'
      ? fiveGames
      : tenGames

  return (
    <PageContainer>
      <Container>
        <h2>{header}</h2>
        <div className="view-selector">
          <ViewSelectorItem
            onClick={() => handleViewChange('Last game')}
            selected={currentView === 'Last game'}
          >
            Last game
          </ViewSelectorItem>
          <ViewSelectorItem
            onClick={() => handleViewChange('Five games')}
            selected={currentView === 'Five games'}
          >
            5 games
          </ViewSelectorItem>
          <ViewSelectorItem
            onClick={() => handleViewChange('Ten games')}
            selected={currentView === 'Ten games'}
          >
            10 games
          </ViewSelectorItem>
        </div>
        <div className="card-container">{createRow(playersToShow)}</div>
      </Container>
    </PageContainer>
  )
}

export default PlayerCardContainer
