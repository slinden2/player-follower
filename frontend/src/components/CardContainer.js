import React, { useContext } from 'react'
import { Container, Header, Divider, Loader } from 'semantic-ui-react'
import { Grid } from 'semantic-ui-react'
import PlayerCard from './PlayerCard'
import { NotificationContext } from '../contexts/NotificationContext'
import { AuthContext } from '../contexts/AuthContext'

const CardContainer = ({ query }) => {
  const { setNotification } = useContext(NotificationContext)
  const { favoritePlayers } = useContext(AuthContext)

  if (query.loading) {
    return <Loader active inline="centered" />
  }

  const { threeGames, fiveGames, tenGames } = query.data.bestPlayers

  const createRow = playerResults => {
    return (
      <Grid centered={true} columns={5}>
        {playerResults.map(player => (
          <Grid.Column key={player.playerId}>
            <PlayerCard
              key={player.playerId}
              player={player}
              setNotification={setNotification}
            />
          </Grid.Column>
        ))}
      </Grid>
    )
  }

  return (
    <Container>
      <Header>Last 3 games</Header>
      {createRow(threeGames)}
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
