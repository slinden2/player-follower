import React, { useContext } from 'react'
import { Container, Header, Divider, Loader } from 'semantic-ui-react'
import { Grid } from 'semantic-ui-react'
import PlayerCardFront from './PlayerCardFront'
import { NotificationContext } from '../contexts/NotificationContext'
import PlayerCard from './PlayerCard'
import PlayerCardBack from './PlayerCardBack'

const CardContainer = ({ query }) => {
  const { setNotification } = useContext(NotificationContext)

  if (query.loading) {
    return <Loader active inline="centered" />
  }

  const { oneGame, fiveGames, tenGames } =
    query.data.bestPlayers || query.data.favoritePlayers

  const createRow = playerResults => {
    if (!playerResults.length) return <div>No results</div>

    return (
      <Grid centered={true} columns={5}>
        {playerResults.map(player => (
          <Grid.Column key={player.playerId}>
            <PlayerCard>
              <PlayerCardFront
                key={player.playerId}
                player={player}
                setNotification={setNotification}
              />
              <PlayerCardBack key={player.playerId} player={player} />
            </PlayerCard>
          </Grid.Column>
        ))}
      </Grid>
    )
  }

  return (
    <Container>
      <Header>Last game</Header>
      {createRow(oneGame)}
      <Divider />
      <Header>Last 5 games</Header>
      {createRow(fiveGames)}
      <Divider />
      <Header>Last 10 games</Header>
      {createRow(tenGames)}
    </Container>
  )
}

export default CardContainer

// Instead of 3 queries make one query for 10 games and process it in the frontend?
