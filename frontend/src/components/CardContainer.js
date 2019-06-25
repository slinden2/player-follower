import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Container, Header, Divider, Loader } from 'semantic-ui-react'
import { Grid } from 'semantic-ui-react'
import PlayerCard from './PlayerCard'
import { BEST_PLAYERS } from '../graphql/queries'

const CardContainer = () => {
  const bestPlayersResult = useQuery(BEST_PLAYERS)

  if (bestPlayersResult.loading) {
    return <Loader active inline="centered" />
  }

  const [
    bestThreeGames,
    bestFiveGames,
    bestTenGames,
  ] = bestPlayersResult.data.bestPlayers

  const sortByPointsAndGoals = (a, b) =>
    b.stats.points - a.stats.points ||
    b.stats.goals - a.stats.goals ||
    b.stats.plusMinus - a.stats.plusMinus

  const createRow = playerResults => {
    console.log(playerResults)
    return (
      <Grid centered={true} columns={5}>
        {playerResults
          .sort((a, b) => sortByPointsAndGoals(a, b))
          .map(player => (
            <Grid.Column key={player.playerId}>
              <PlayerCard key={player.playerId} player={player} />
            </Grid.Column>
          ))}
      </Grid>
    )
  }

  return (
    <Container>
      <Header>Last 3 games</Header>
      {createRow(bestThreeGames)}
      <Divider />
      <Header>Last 5 games</Header>
      {createRow(bestFiveGames)}
      <Divider />
      <Header>Last 10 games</Header>
      {createRow(bestTenGames)}
    </Container>
  )
}

export default CardContainer

// Instead of 3 queries make one query for 10 games and process it in the frontend?
