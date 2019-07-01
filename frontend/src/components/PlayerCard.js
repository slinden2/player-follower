import React, { useContext } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Card, Image, Icon } from 'semantic-ui-react'
import { FOLLOW_PLAYER, UNFOLLOW_PLAYER } from '../graphql/mutations'
import { NotificationContext } from '../contexts/NotificationContext'
import { FAVORITE_PLAYERS } from '../graphql/queries'

const PlayerCard = ({ player }) => {
  const { setNotification, handleException } = useContext(NotificationContext)

  const followPlayer = useMutation(FOLLOW_PLAYER, {
    variables: { id: player.id },
    refetchQueries: [{ query: FAVORITE_PLAYERS }],
  })

  const unfollowPlayer = useMutation(UNFOLLOW_PLAYER, {
    variables: { id: player.id },
    refetchQueries: [{ query: FAVORITE_PLAYERS }],
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
    } catch (exception) {
      handleException(exception)
    }
  }

  const handleUnfollow = async () => {
    try {
      const id = await unfollowPlayer()
      if (id.data.unfollowPlayer) {
        setNotification('positive', `You unfollowed ${id.data.unfollowPlayer}.`)
      }
    } catch (exception) {
      handleException(exception)
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
          <Icon name="thumbs down outline" onClick={handleUnfollow} />
        </div>
      </Card.Content>
    </Card>
  )
}

export default PlayerCard
