import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import styled from 'styled-components'
import colors from '../../styles/colors'
import { NotificationContext } from '../../contexts/NotificationContext'
import { AuthContext } from '../../contexts/AuthContext'
import { PlayerContext } from '../../contexts/PlayerContext'
import { cardImgUrl } from '../../utils'

const SPlayerCardFront = styled.div`
  border-radius: 10px;

  && > img {
    width: 75%;
    box-shadow: 1px 1px 1px 2px rgba(0, 0, 0, 0.15);
    border-radius: 50%;
    display: block;
    margin: auto;
  }
`

const SPlayerName = styled.div`
  & > p {
    display: inline-block;
    width: 35%;
    text-align: right;
    vertical-align: middle;
    margin-bottom: 0;
    padding-right: 10px;
    font-size: 1.5rem;
  }

  & > div {
    display: inline-block;
    width: 35%;
    vertical-align: middle;
    padding-left: 10px;
    border-left: 2px solid ${colors.grey2};

    & p {
      margin: 0;
      font-size: 1.125rem;
    }
  }
`

const PlayerCardFront = ({ player }) => {
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
    <SPlayerCardFront>
      <img src={cardImgUrl(player.playerId)} alt="player profile" />
      <SPlayerName>
        <p>#{player.primaryNumber}</p>
        <div>
          <p>{player.firstName}</p>
          <p>{player.lastName}</p>
        </div>
      </SPlayerName>
      <div>
        G: {player.stats.goals} | A: {player.stats.assists} | P:{' '}
        {player.stats.points} | PM: {player.stats.penaltyMinutes} | +/-:{' '}
        {player.stats.plusMinus}
      </div>
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
    </SPlayerCardFront>
  )
}

export default PlayerCardFront
