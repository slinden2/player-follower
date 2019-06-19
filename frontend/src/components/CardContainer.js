import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Container, Header, Divider } from 'semantic-ui-react'
import { Grid } from 'semantic-ui-react'
import PlayerCard from './PlayerCard'
import { LAST_GAMES_STATS } from '../graphql/queries'

const CardContainer = () => {
  const playerResults10 = useQuery(LAST_GAMES_STATS, {
    variables: {
      playerIds: [8471214, 8478402, 8476453, 8478427, 8477493],
      numOfGames: 10,
    },
  })

  const playerResults5 = useQuery(LAST_GAMES_STATS, {
    variables: {
      playerIds: [8471214, 8478402, 8476453, 8478427, 8477493],
      numOfGames: 5,
    },
  })

  const playerResults3 = useQuery(LAST_GAMES_STATS, {
    variables: {
      playerIds: [8471214, 8478402, 8476453, 8478427, 8477493],
      numOfGames: 3,
    },
  })

  if (
    playerResults10.loading ||
    playerResults5.loading ||
    playerResults3.loading
  ) {
    return <div>Loading...</div>
  }

  const sortByPointsAndGoals = (a, b) =>
    b.stats.points - a.stats.points || b.stats.goals - a.stats.goals

  const createRow = playerResults => {
    return (
      <Grid centered={true} columns={5}>
        {playerResults.data.getStatsInRange
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
      {createRow(playerResults3)}
      <Divider />
      <Header>Last 5 games</Header>
      {createRow(playerResults5)}
      <Divider />
      <Header>Last 10 games</Header>
      {createRow(playerResults10)}
    </Container>
  )
}

export default CardContainer

// Instead of 3 queries make one query for 10 games and process it in the frontend?
