import React, { useContext, useState } from 'react'
import { Loader } from 'semantic-ui-react'
import PlayerCardFront from './PlayerCardFront'
import { NotificationContext } from '../../contexts/NotificationContext'
import PlayerCard from './PlayerCard'
import PlayerCardBack from './PlayerCardBack'
import styled from 'styled-components'
import colors from '../../styles/colors'

const SCardContainer = styled.div`
  background: ${colors.grey2};
  padding: 1px 10px;
  border-radius: 10px;
  margin-top: 10px;

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

const PlayerCardContainer = ({ query }) => {
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
    <>
      <SCardContainer>
        <h2>{currentView}</h2>
        <div className="view-selector">
          <span onClick={() => setCurrentView('Last game')}>Last game</span>
          <span onClick={() => setCurrentView('Five games')}>5 games</span>
          <span onClick={() => setCurrentView('Ten games')}>10 games</span>
        </div>
        <div className="card-container">{createRow(playersToShow)}</div>
      </SCardContainer>
    </>
  )
}

export default PlayerCardContainer
