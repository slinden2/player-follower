import React, { useContext } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Card, Image, Icon } from 'semantic-ui-react'
import { FOLLOW_PLAYER, UNFOLLOW_PLAYER } from '../graphql/mutations'
import { NotificationContext } from '../contexts/NotificationContext'
import { USER, FAVORITE_PLAYERS } from '../graphql/queries'
import { AuthContext } from '../contexts/AuthContext'

const PlayerCard = ({ player }) => {
  const { setNotification, handleException } = useContext(NotificationContext)
  const { token, favPlayerRanking, user } = useContext(AuthContext)

  const followPlayer = useMutation(FOLLOW_PLAYER, {
    variables: { id: player.id },
    refetchQueries: [{ query: FAVORITE_PLAYERS }],
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: USER })
      dataInStore.me.favoritePlayers = dataInStore.me.favoritePlayers.concat(
        player.id
      )
      store.writeQuery({ query: USER, data: dataInStore })
    },
  })

  const unfollowPlayer = useMutation(UNFOLLOW_PLAYER, {
    variables: { id: player.id },
    refetchQueries: [{ query: FAVORITE_PLAYERS }],
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: USER })
      dataInStore.me.favoritePlayers = dataInStore.me.favoritePlayers.filter(
        id => id !== player.id
      )
      store.writeQuery({ query: USER, data: dataInStore })
    },
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

  const idInArray = (array, id) => array.some(pid => pid === id)

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
          {token && (
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
