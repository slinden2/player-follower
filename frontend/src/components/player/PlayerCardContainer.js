import React, { useContext, useState } from 'react'
import { Loader } from 'semantic-ui-react'
import PlayerCardFront from './PlayerCardFront'
import { NotificationContext } from '../../contexts/NotificationContext'
import PlayerCard from './PlayerCard'
import PlayerCardBack from './PlayerCardBack'
import PageContainer from '../elements/PageContainer'
import styled from 'styled-components'
import colors from '../../styles/colors'

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
    grid-gap: 20px;
  }
`

const ViewSelectorItem = styled.span`
  cursor: pointer;
  ${props => props.selected && 'font-weight: bold'};
`

const PlayerCardContainer = ({ query, header }) => {
  const [currentView, setCurrentView] = useState('Last game')
  const { setNotification } = useContext(NotificationContext)

  if (query.loading) {
    return <Loader active inline="centered" />
  }

  const { oneGame, fiveGames, tenGames } =
    query.data.bestPlayers || query.data.favoritePlayers

  const createRow = playerResults => {
    if (!playerResults.length) return <div>No results</div>

    return playerResults.map(player => (
      <PlayerCard key={player.playerId}>
        <PlayerCardFront player={player} setNotification={setNotification} />
        <PlayerCardBack key={player.playerId} player={player} />
      </PlayerCard>
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
            onClick={() => setCurrentView('Last game')}
            selected={currentView === 'Last game'}
          >
            Last game
          </ViewSelectorItem>
          <ViewSelectorItem
            onClick={() => setCurrentView('Five games')}
            selected={currentView === 'Five games'}
          >
            5 games
          </ViewSelectorItem>
          <ViewSelectorItem
            onClick={() => setCurrentView('Ten games')}
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
