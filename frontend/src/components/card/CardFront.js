import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { event } from '../../utils/tracking'
import colors from '../../styles/colors'
import { NotificationContext } from '../../contexts/NotificationContext'
import { AuthContext } from '../../contexts/AuthContext'
import { PlayerContext } from '../../contexts/PlayerContext'
import FlipDiv from './FlipDiv'
import {
  statHeaders,
  goalieStatHeaders,
  sortByHighlight,
  teamStatHeaders,
} from '../../utils'
import ImageCircle from './ImageCircle'
import { FrontContainer } from './styles'

const FavImg = styled.svg`
  position: absolute;
  left: 15px;
  top: 15px;
  width: 27px;
  height: 28px;
  stroke: ${colors.grey1};

  & path {
    fill: ${({ isFav }) => (isFav ? colors.yellow1 : 'none')};
    stroke-width: 1;
  }
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
  ${({ outerMargin }) =>
    outerMargin &&
    css`
      margin-left: 20px;
      margin-right: 20px;
    `}
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

const PlayerCardFront = ({
  context,
  data,
  isFlipped,
  handleCardFlip,
  i,
  sortBy,
  dataCy,
}) => {
  const { setNotification, handleException } = useContext(NotificationContext)
  const { followPlayer, unfollowPlayer } = useContext(PlayerContext)
  const { token, user } = useContext(AuthContext)
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    if (token && user.data.me) {
      setIsFav(idInArray(user.data.me.favoritePlayers, data._id))
    }
  }, [data._id, token, user.data.me])

  if (token && !user.data) {
    return null
  }

  let playerBioData = {}
  if (context !== 'team') {
    playerBioData = {
      isLongName: data.player.firstName > 9 || data.player.lastName > 9,
      imageData: {
        name: data.player.lastName,
        number: data.player.primaryNumber,
        team: data.team.abbreviation,
      },
      link: `/players/${data.player.siteLink}`,
      genData: {
        left: {
          text: data.team.abbreviation,
          link: `/teams/${data.team.siteLink}`,
        },
        center: {
          top: data.player.firstName,
          bottom: data.player.lastName,
        },
        right: {
          text: data.player.primaryPosition.abbreviation,
        },
      },
    }
  }

  const contextSelector = {
    player: () => ({
      ...playerBioData,
      stats: {
        statArray: [
          ['points', 'goals', 'assists'],
          ['plusMinus', 'penaltyMinutes'],
        ],
        stats: data.stats,
        headers: statHeaders,
      },
      isHighlighted: stat => stat === sortByHighlight[sortBy],
    }),
    goalie: () => ({
      ...playerBioData,
      stats: {
        statArray: [
          ['wins', 'losses', 'shutouts'],
          ['savePct', 'goalsAgainstAverage'],
        ],
        stats: data.stats,
        headers: goalieStatHeaders,
      },
      isHighlighted: stat => stat === sortByHighlight[sortBy],
    }),
    team: () => ({
      isLongName:
        data.team.locationName.length > 11 || data.team.teamName.length > 11,
      imageData: {
        number: data.team.abbreviation,
        team: data.team.abbreviation,
      },
      link: `/teams/${data.team.siteLink}`,
      genData: {
        left: (
          <span title={data.conference.name}>
            {data.conference.abbreviation}
          </span>
        ),
        center: {
          top: data.team.locationName,
          bottom: data.team.teamName,
        },
        right: (
          <span title={data.division.name}>{data.division.abbreviation}</span>
        ),
      },
      stats: {
        statArray: [
          ['wins', 'losses', 'otLosses'],
          ['homeRecord', 'awayRecord'],
        ],
        stats: data.stats,
        headers: teamStatHeaders,
      },
      isHighlighted: stat => stat === sortBy,
    }),
  }

  const curContext = contextSelector[context]()

  const handleFollow = async () => {
    event(
      'PLAYER_CARD',
      'Follow Player',
      `${data.player.firstName} ${data.player.lastName}`
    )
    try {
      const followedPlayer = await followPlayer({
        variables: { id: data._id, followType: 'FOLLOW' },
      })
      if (followedPlayer.data.FollowPlayer) {
        setNotification(
          'positive',
          `You started following ${followedPlayer.data.FollowPlayer.fullName}.`,
          'site'
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
      `${data.player.firstName} ${data.player.lastName}`
    )
    try {
      const id = await unfollowPlayer({
        variables: { id: data._id, followType: 'UNFOLLOW' },
      })
      if (id.data.FollowPlayer) {
        setNotification(
          'positive',
          `You unfollowed ${id.data.FollowPlayer.fullName}.`,
          'site'
        )
      }
    } catch (exception) {
      handleException(exception)
    }
  }

  return (
    <FrontContainer isFlipped={isFlipped} data-cy={dataCy}>
      <Link to={curContext.link}>
        <ImageCircle {...curContext.imageData} />
      </Link>
      <OrderNumber>{i}</OrderNumber>
      <GenDataContainer>
        <SideContainer border='right'>
          {curContext.genData.left.link ? (
            <Link to={curContext.genData.left.link}>
              {curContext.genData.left.text}
            </Link>
          ) : (
            curContext.genData.left
          )}
        </SideContainer>
        <PlayerName smallFont={curContext.isLongName}>
          <Link to={curContext.link}>
            {curContext.genData.center.top}
            <br />
            {curContext.genData.center.bottom}
          </Link>
        </PlayerName>
        <SideContainer border='left'>
          {curContext.genData.right.text
            ? curContext.genData.right.text
            : curContext.genData.right}
        </SideContainer>
      </GenDataContainer>
      <StatsContainer>
        {curContext.stats.statArray.map((statRow, i) => (
          <StatRow key={i} outerMargin={i === 1}>
            {statRow.map(stat => (
              <StatItem
                key={stat}
                isHighlighted={curContext.isHighlighted(stat)}
              >
                <StatHeader title={curContext.stats.headers[stat].title}>
                  {curContext.stats.headers[stat].headerText}
                </StatHeader>
                <Stat>{curContext.stats.stats[stat]}</Stat>
              </StatItem>
            ))}
          </StatRow>
        ))}
      </StatsContainer>
      {context === 'player' && token && user.data.me && (
        <FavImg
          xmlns='http://www.w3.org/2000/svg'
          isFav={isFav}
          onClick={isFav ? handleUnfollow : handleFollow}
        >
          <path d='M13.496 1.5l-3.706 7.901L1.5 10.67l6.002 6.1463L6.0887 25.5l7.4147-4.102 7.4182 4.0963-1.4194-8.6818 5.9978-6.15-8.292-1.2635z' />
        </FavImg>
      )}
      <FlipDiv onClick={handleCardFlip} />
    </FrontContainer>
  )
}

export default PlayerCardFront
