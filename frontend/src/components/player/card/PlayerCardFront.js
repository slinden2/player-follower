import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { event } from '../../../utils/tracking'
import colors from '../../../styles/colors'
import { NotificationContext } from '../../../contexts/NotificationContext'
import { AuthContext } from '../../../contexts/AuthContext'
import { PlayerContext } from '../../../contexts/PlayerContext'
import FlipDiv from './FlipDiv'
import { statHeaders, cardImgUrl } from '../../../utils'
import starDisabled from '../../../assets/star-disable.svg'
import starEnabled from '../../../assets/star-enable.svg'
import fallbackImage from '../../../assets/noimg-card.png'

const SPlayerCardFrontContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  position: absolute;
  transform: rotateX(0deg);
  backface-visibility: hidden;
`

const PlayerImg = styled.img`
  width: 168px;
  height: 168px;
  border-radius: 50%;
  display: block;
  margin: auto;
`

const ImgOverlay = styled.div`
  position: absolute;
  width: 168px;
  height: 168px;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  left: 40px;
  top: 0px;
`

const FavImg = styled.img`
  position: absolute;
  width: 24px;
  height: 24px;
  left: 15px;
  top: 10px;
`

const SPlayerName = styled.div`
  border-bottom: 3px solid ${colors.grey2};
  padding-bottom: 2px;
  margin: 0 auto;

  & > p:first-child {
    display: inline-block;
    width: 25%;
    text-align: right;
    vertical-align: middle;
    margin: 0;
    padding-right: 10px;
    font-size: 1.25rem;

    & > span {
      color: ${colors.grey1};
    }
  }

  & > p:last-child {
    display: inline-block;
    width: 25%;
    vertical-align: middle;
    margin: 0;
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
      font-size: ${props => (props.reduceFont ? '1rem' : '1.375rem')};
    }
  }
`

const SPlayerStatsContainer = styled.div`
  margin: auto;
  padding: 3px 18px;
  font-size: 1.125rem;
  text-shadow: 1px 1px ${colors.grey2};
  border-bottom: ${props => (props.border ? '3px' : '0px')} solid
    ${colors.grey2};

  & div {
    display: inline-block;
    margin: auto;
  }

  & > div {
    width: ${props => props.width};

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

const handleImgNotFound = e => {
  e.target.src = fallbackImage
}

const PlayerCardFront = ({ player, handleCardFlip }) => {
  const { setNotification, handleException } = useContext(NotificationContext)
  const { followPlayer, unfollowPlayer } = useContext(PlayerContext)
  const { token, user } = useContext(AuthContext)

  const handleFollow = async () => {
    event(
      'PLAYER_CARD',
      'Follow Player',
      `${player.firstName} ${player.lastName}`
    )
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
    event(
      'PLAYER_CARD',
      'Unfollow Player',
      `${player.firstName} ${player.lastName}`
    )
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

  const longName = player.lastName.length > 9 || player.lastName.length > 9

  return (
    <SPlayerCardFrontContainer>
      <PlayerImg
        img
        src={cardImgUrl(player.playerId)}
        alt="player profile"
        onError={handleImgNotFound}
      />
      <ImgOverlay />
      <SPlayerName reduceFont={longName}>
        <p className="team-name">
          <Link to={`/teams/${player.currentTeam.siteLink}`}>
            {player.currentTeam.abbreviation}
          </Link>
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
            <div title={statHeaders.goals.title}>
              {statHeaders.goals.headerText}
            </div>
            <div>{player.stats.goals}</div>
          </div>
          <div>
            <div title={statHeaders.assists.title}>
              {statHeaders.assists.headerText}
            </div>
            <div>{player.stats.assists}</div>
          </div>
          <div>
            <div title={statHeaders.points.title}>
              {statHeaders.points.headerText}
            </div>
            <div>{player.stats.points}</div>
          </div>
        </SPlayerStatsContainer>
        <SPlayerStatsContainer width="50%" border>
          <div>
            <div title={statHeaders.penaltyMinutes.title}>
              {statHeaders.penaltyMinutes.headerText}
            </div>
            <div>{player.stats.penaltyMinutes}</div>
          </div>
          <div>
            <div title={statHeaders.plusMinus.title}>
              {statHeaders.plusMinus.headerText}
            </div>
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
      <FlipDiv onClick={handleCardFlip} />
    </SPlayerCardFrontContainer>
  )
}

export default PlayerCardFront
