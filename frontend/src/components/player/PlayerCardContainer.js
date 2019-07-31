import React, { useContext } from 'react'
import { Loader } from 'semantic-ui-react'
import PlayerCardFront from './PlayerCardFront'
import { NotificationContext } from '../../contexts/NotificationContext'
import PlayerCard from './PlayerCard'
import PlayerCardBack from './PlayerCardBack'
import SCardContainer from '../../styles/elements/SCardContainer'

const PlayerCardContainer = ({ query }) => {
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

  return (
    <>
      <SCardContainer>
        <h2>Last game</h2>
        <div className="view-selector">
          <span>Last game</span>
          <span>5 games</span>
          <span>10 games</span>
        </div>
        {createRow(oneGame)}
      </SCardContainer>
      <SCardContainer>
        <h2>Last 5 games</h2>
        {createRow(fiveGames)}
      </SCardContainer>
      <SCardContainer>
        <h2>Last 10 games</h2>
        {createRow(tenGames)}
      </SCardContainer>
    </>
  )
}

export default PlayerCardContainer
