import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import styled from 'styled-components'
import colors from '../../styles/colors'
import { NotificationContext } from '../../contexts/NotificationContext'
import { AuthContext } from '../../contexts/AuthContext'
import { PlayerContext } from '../../contexts/PlayerContext'
import { cardImgUrl } from '../../utils'
import starDisabled from '../../assets/star-disable.svg'
import starEnabled from '../../assets/star-enable.svg'

const SPlayerCardFrontContainer = styled.div`
  border-radius: 10px;
  position: relative;
`

const PlayerImg = styled.img`
  width: 75%;
  border-radius: 50%;
  display: block;
  margin: auto;
`

const ImgOverlay = styled.div`
  position: absolute;
  width: 181px;
  height: 181px;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  bottom: 112px;
  left: 28px;
`

const FavImg = styled.img`
  position: absolute;
  width: 24px;
  height: 24px;
  left: 12px;
  bottom: 260px;
`

const SPlayerName = styled.div`
  border-bottom: 3px solid ${colors.grey2};
  padding-bottom: 2px;

  & > p:first-child {
    display: inline-block;
    width: 25%;
    text-align: right;
    vertical-align: middle;
    margin-bottom: 0;
    padding-right: 10px;
    font-size: 1.5rem;

    & > span {
      color: ${colors.grey1};
    }
  }

  & > p:last-child {
    display: inline-block;
    width: 25%;
    vertical-align: middle;
    margin-bottom: 0;
    padding-left: 10px;
    font-size: 1.5rem;

    & > span {
      color: ${colors.grey1};
    }
  }

  & > div {
    display: inline-block;
    width: 50%;
    text-align: center;
    vertical-align: middle;
    border-left: 2px solid ${colors.grey2};
    border-right: 2px solid ${colors.grey2};

    & p {
      margin: 0;
      font-size: 1.375rem;
    }

    & a {
      /* text-decoration: none; */
    }
  }
`

const SPlayerStatsContainer = styled.div`
  margin: auto;
  padding: 3px 18px;
  font-size: 1.125rem;
  border-bottom: ${props => (props.border ? '3px' : '0px')} solid
    ${colors.grey2};

  & div {
    display: inline-block;
    margin: auto;
  }

  & > div {
    width: ${props => props.width};
    box-sizing: border-box;

    & div {
      width: 50%;
    }

    & div:first-child {
      text-align: right;
      padding-right: 5px;
    }

    & div:last-child {
      padding-left: 5px;
    }
  }
`

const idInArray = (array, id) => array.some(pid => pid === id)

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

  return (
    <SPlayerCardFrontContainer>
      <PlayerImg img src={cardImgUrl(player.playerId)} alt="player profile" />
      <ImgOverlay />
      <SPlayerName>
        <p>
          <span>#</span>
          {player.primaryNumber}
        </p>
        <div>
          <p>
            <Link to={`/players/${player.siteLink}`}>
              {player.firstName}
              <br />
              {player.lastName}
            </Link>
          </p>
        </div>
        <p>
          <span>#</span>
          {player.primaryNumber}
        </p>
      </SPlayerName>
      <div>
        <SPlayerStatsContainer width="33%">
          <div>
            <div>G</div>
            <div>{player.stats.goals}</div>
          </div>
          <div>
            <div>A</div>
            <div>{player.stats.assists}</div>
          </div>
          <div>
            <div>P</div>
            <div>{player.stats.points}</div>
          </div>
        </SPlayerStatsContainer>
        <SPlayerStatsContainer width="50%" border>
          <div>
            <div>PM</div>
            <div>{player.stats.penaltyMinutes}</div>
          </div>
          <div>
            <div>+/-</div>
            <div>{player.stats.plusMinus}</div>
          </div>
        </SPlayerStatsContainer>
      </div>
      {token && user.data.me && (
        <>
          {!idInArray(user.data.me.favoritePlayers, player.id) && (
            <FavImg src={starDisabled} onClick={handleFollow} />
          )}
          {idInArray(user.data.me.favoritePlayers, player.id) && (
            <FavImg src={starEnabled} onClick={handleUnfollow} />
          )}
        </>
      )}
    </SPlayerCardFrontContainer>
  )
}

export default PlayerCardFront
