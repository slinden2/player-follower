import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Card, Image, Icon } from 'semantic-ui-react'
import { FOLLOW_PLAYER } from '../graphql/mutations'

const PlayerCard = ({ player, setNotification }) => {
  const followPlayer = useMutation(FOLLOW_PLAYER, {
    variables: { id: player.id },
  })

  const handleFollow = async () => {
    try {
      const followedPlayer = await followPlayer()
      if (followedPlayer.data.followPlayer) {
        setNotification(
          'positive',
          `You started following ${followedPlayer.data.followPlayer.fullName}.`
        )
      }
    } catch ({ message }) {
      setNotification('negative', `${message}`)
    }
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
