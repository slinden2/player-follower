import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { event } from '../../../utils/tracking'
import colors from '../../../styles/colors'
import { NotificationContext } from '../../../contexts/NotificationContext'
import { AuthContext } from '../../../contexts/AuthContext'
import { PlayerContext } from '../../../contexts/PlayerContext'
import FlipDiv from './FlipDiv'
import { statHeaders } from '../../../utils'
import starDisabled from '../../../assets/star-disable.svg'
import starEnabled from '../../../assets/star-enable.svg'
import fallbackImage from '../../../assets/noimg-card.png'
import ImageCircle from './ImageCircle'

const SPlayerCardFrontContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  position: absolute;
  transform: rotateX(0deg);
  backface-visibility: hidden;
`

const FavImg = styled.img`
  position: absolute;
  width: 24px;
  height: 24px;
  left: 15px;
  top: 10px;
`

const GenDataContainer = styled.div`
  height: 60px;
  display: flex;
  justify-content: space-between;
  border-bottom: 3px solid ${colors.grey2};
`

const genItemStyles = css`
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
`

const SideContainer = styled.div`
  ${genItemStyles}
  width: 60px;

  ${({ border }) =>
    border &&
    css`
    border-${border}: 3px solid ${colors.grey2};
  `}

  ${({ numIndicator }) =>
    numIndicator &&
    css`
      &::before {
        content: '#';
        margin-right: 5px;
        color: ${colors.grey1};
      }
    `}
`

const PlayerName = styled.div`
  ${genItemStyles}
  text-align: center;

  ${({ smallFont }) =>
    smallFont &&
    css`
      font-size: 1rem;
    `}
`

const StatsContainer = styled.div`
  border-bottom: 3px solid ${colors.grey2};
`

const StatRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 5px;
`

const StatItem = styled.div`
  padding: 5px;
  display: flex;
  line-height: 0.75rem;

  ${({ stat }) =>
    stat === 'points' &&
    css`
      border-radius: 10px;
      background-color: ${colors.blue1};
      box-shadow: 0px 0px 1px 0.25px ${colors.grey1};
    `}
`

const statStyling = css`
  padding: 0 5px;
`

const StatHeader = styled.div`
  ${statStyling}
`

const Stat = styled.div`
  ${statStyling}
`

const OrderNumber = styled.div`
  position: absolute;
  font-size: 0.75rem;
  top: 0;
  right: 10px;
`

const idInArray = (array, id) => array.some(pid => pid === id)

const statArrays = [
  ['points', 'goals', 'assists'],
  ['plusMinus', 'penaltyMinutes'],
]

const PlayerCardFront = ({ player, handleCardFlip, i }) => {
  const { setNotification, handleException } = useContext(NotificationContext)
  const { followPlayer, unfollowPlayer } = useContext(PlayerContext)
  const { token, user } = useContext(AuthContext)

  const handleFollow = async () => {
    event(
      'PLAYER_CARD',
      'Follow Player',
      `${player.player.firstName} ${player.player.lastName}`
    )
    try {
      const followedPlayer = await followPlayer({
        variables: { id: player._id, followType: 'FOLLOW' },
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
      `${player.player.firstName} ${player.player.lastName}`
    )
    try {
      const id = await unfollowPlayer({
        variables: { id: player._id, followType: 'UNFOLLOW' },
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

  const longName =
    player.player.firstName.length > 10 || player.player.lastName.length > 10

  return (
    <SPlayerCardFrontContainer>
      <ImageCircle
        name={player.player.lastName}
        number={player.player.primaryNumber}
        longName={longName}
        team={player.team.abbreviation}
      />
      <OrderNumber>{i}</OrderNumber>
      <GenDataContainer>
        <SideContainer border="right">
          <Link to={`/teams/${player.team.siteLink}`}>
            {player.team.abbreviation}
          </Link>
        </SideContainer>
        <PlayerName smallFont={longName}>
          <Link to={`/players/${player.player.siteLink}`}>
            {player.player.firstName}
            <br />
            {player.player.lastName}
          </Link>
        </PlayerName>
        <SideContainer numIndicator border="left">
          {player.player.primaryNumber}
        </SideContainer>
      </GenDataContainer>
      <StatsContainer>
        {statArrays.map((statRow, i) => (
          <StatRow key={i}>
            {statRow.map(stat => (
              <StatItem key={stat} stat={stat}>
                <StatHeader title={statHeaders[stat].title}>
                  {statHeaders[stat].headerText}
                </StatHeader>
                <Stat>{player.stats[stat]}</Stat>
              </StatItem>
            ))}
          </StatRow>
        ))}
      </StatsContainer>
      {token && user.data.me && (
        <>
          {!idInArray(user.data.me.favoritePlayers, player._id) && (
            <FavImg src={starDisabled} onClick={handleFollow} />
          )}
          {idInArray(user.data.me.favoritePlayers, player._id) && (
            <FavImg src={starEnabled} onClick={handleUnfollow} />
          )}
        </>
      )}
      <FlipDiv onClick={handleCardFlip} />
    </SPlayerCardFrontContainer>
  )
}

export default PlayerCardFront
