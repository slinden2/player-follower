import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { event } from '../../../utils/tracking'
import colors from '../../../styles/colors'
import { commonStyles } from './playerCardStyles'
import { NotificationContext } from '../../../contexts/NotificationContext'
import { AuthContext } from '../../../contexts/AuthContext'
import { PlayerContext } from '../../../contexts/PlayerContext'
import FlipDiv from './FlipDiv'
import { statHeaders, sortByHighlight } from '../../../utils'
import starDisabled from '../../../assets/star-disable.svg'
import starEnabled from '../../../assets/star-enable.svg'
import ImageCircle from './ImageCircle'

const Container = styled.div`
  ${commonStyles}

  padding-top: 10px;

  transform: rotateY(0deg);

  ${({ isFlipped }) =>
    isFlipped &&
    css`
      transform: rotateY(-180deg);
    `}
`

const FavImg = styled.img`
  position: absolute;
  width: 24px;
  height: 24px;
  left: 15px;
  top: 15px;
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

  ${({ isHighlighted }) =>
    isHighlighted &&
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
  top: 5px;
  right: 10px;
`

const idInArray = (array, id) => array.some(pid => pid === id)

const statArrays = [
  ['points', 'goals', 'assists'],
  ['plusMinus', 'penaltyMinutes'],
]

const PlayerCardFront = ({ player, isFlipped, handleCardFlip, i, sortBy }) => {
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
    player.player.firstName.length > 9 || player.player.lastName.length > 9

  return (
    <Container isFlipped={isFlipped}>
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
        <SideContainer border="left">
          {player.player.primaryPosition.abbreviation}
        </SideContainer>
      </GenDataContainer>
      <StatsContainer>
        {statArrays.map((statRow, i) => (
          <StatRow key={i}>
            {statRow.map(stat => (
              <StatItem
                key={stat}
                isHighlighted={stat === sortByHighlight[sortBy]}
              >
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
    </Container>
  )
}

export default PlayerCardFront
