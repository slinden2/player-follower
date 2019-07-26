import React from 'react'
import { Card, Grid } from 'semantic-ui-react'

const PlayerCardBack = ({ player }) => {
  return (
    <>
      <Card.Header>
        {player.firstName} {player.lastName}
      </Card.Header>
      <Card.Content>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>TON/GP: {player.stats.timeOnIcePerGame}</Grid.Column>
            <Grid.Column>Shots: {player.stats.shots}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>Hits: {player.stats.hits}</Grid.Column>
            <Grid.Column>PPG: {player.stats.powerPlayGoals}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>PPP: {player.stats.powerPlayPoints}</Grid.Column>
            <Grid.Column>SHG: {player.stats.shortHandedGoals}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>FOT: {player.stats.faceOffsTaken}</Grid.Column>
            <Grid.Column>blocked: {player.stats.blocked}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>TA: {player.stats.takeaways}</Grid.Column>
            <Grid.Column>GA: {player.stats.giveaways}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </>
  )
}

export default PlayerCardBack
