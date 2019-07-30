import React, { useContext } from 'react'
import { Header, Loader } from 'semantic-ui-react'
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

    console.log(playerResults[0])

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
        <Header>Last game</Header>
        {createRow(oneGame)}
      </SCardContainer>
      <SCardContainer>
        <Header>Last 5 games</Header>
        {createRow(fiveGames)}
      </SCardContainer>
      <SCardContainer>
        <Header>Last 10 games</Header>
        {createRow(tenGames)}
      </SCardContainer>
    </>
  )
}

export default PlayerCardContainer
