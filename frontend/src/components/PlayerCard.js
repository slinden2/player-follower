import React, { useContext, useEffect } from 'react'
import { Card, Image, Icon } from 'semantic-ui-react'
import { NotificationContext } from '../contexts/NotificationContext'
import { AuthContext } from '../contexts/AuthContext'
import { PlayerContext } from '../contexts/PlayerContext'

// const imgUrl = playerId => `http://3.cdn.nhle.com/photos/mugs/${playerId}.jpg`
const imgUrl = playerId =>
  `https://nhl.bamcontent.com/images/headshots/current/168x168/${playerId}.jpg`

const PlayerCard = ({ player }) => {
  const { setNotification, handleException } = useContext(NotificationContext)
  const { followPlayer, unfollowPlayer } = useContext(PlayerContext)
  const { token, user } = useContext(AuthContext)

  const handleFollow = async () => {
    try {
      const followedPlayer = await followPlayer({
        variables: { id: player.id, followType: 'FOLLOW' },
      })
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
      const id = await unfollowPlayer({
        variables: { id: player.id, followType: 'UNFOLLOW' },
      })
      if (id.data.unfollowPlayer) {
        setNotification(
          'positive',
          `You unfollowed ${id.data.unfollowPlayer.fullName}.`
        )
      }
    } catch (exception) {
      handleException(exception)
    }
  }

  const idInArray = (array, id) => array.some(pid => pid === id)

  return (
    <Card>
      <Image src={imgUrl(player.playerId)} wrapped ui={false} />
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
          {token && user.data.me && (
            <>
              {!idInArray(user.data.me.favoritePlayers, player.id) && (
                <Icon name="thumbs up" onClick={handleFollow} />
              )}
              {idInArray(user.data.me.favoritePlayers, player.id) && (
                <Icon name="thumbs down outline" onClick={handleUnfollow} />
              )}
            </>
          )}
        </div>
      </Card.Content>
    </Card>
  )
}

export default PlayerCard
