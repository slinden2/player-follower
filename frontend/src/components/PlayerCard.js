import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Card, Image, Icon } from 'semantic-ui-react'

const PlayerCard = ({ player }) => {
  const followPlayer = useMutation()

  const handleFollow = () => {
    console.log(player)
  }

  return (
    <Card>
      <Image src="img/test.png" wrapped ui={false} />
      <Card.Content>
        <Card.Header>
          {player.firstName} {player.lastName}
        </Card.Header>
        <Card.Meta>#{player.primaryNumber}</Card.Meta>
        <Card.Description>
          G: {player.stats.goals} | A: {player.stats.assists} | P:{' '}
          {player.stats.points} | PM: {player.stats.penaltyMinutes} | +/-:{' '}
          {player.stats.plusMinus}
        </Card.Description>
        <div>
          <Icon name="thumbs up" onClick={handleFollow} />
          <Icon name="thumbs down outline" />
        </div>
      </Card.Content>
    </Card>
  )
}

export default PlayerCard
