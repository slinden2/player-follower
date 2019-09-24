import React from 'react'
import { Link } from 'react-router-dom'
import { statHeaders } from '../../../utils'
import styled from 'styled-components'
import FlipDiv from './FlipDiv'
import colors from '../../../styles/colors'

const Container = styled.div`
  width: 100%;
  height: 100%;
  transform: rotateY(180deg);
  position: absolute;
  backface-visibility: hidden;
`

const NameBar = styled.div`
  background-color: ${colors.blue1};
  position: absolute;
  width: 100%;
  text-align: center;
  padding: 8px;
  top: -5px;
  left: 0;
  font-size: 1.375rem;
  text-shadow: 1px 1px ${colors.grey2};
  border-radius: 10px 10px 0px 0px;
`

const StatRow = styled.div`
  margin-top: ${props => (props.first ? '40px' : '0px')};
  border-bottom: ${props => (props.last ? '3px' : '0px')} solid ${colors.grey2};
  text-shadow: 1px 1px ${colors.grey2};
`

const StatItem = styled.div`
  display: inline-block;
  width: 50%;
  padding: 5px 10px;
  border-right: ${props => (props.rightBorder ? '2px' : '0px')} solid
    ${colors.grey2};

  & p {
    width: 50%;
    display: inline-block;
    font-size: 1.125rem;
    margin: 0;
  }

  & p:first-child {
    padding-right: 5px;
    text-align: ${props => (props.descRight ? 'center' : 'left')};
  }

  & p:last-child {
    padding-left: 5px;
    text-align: ${props => (props.descRight ? 'right' : 'center')};
  }
`

const PlayerCardBack = ({ player, handleCardFlip }) => {
  return (
    <Container>
      <NameBar>
        <Link to={`/players/${player.siteLink}`}>
          {player.player.firstName + ' ' + player.player.lastName}
        </Link>
      </NameBar>
      <StatRow first>
        <StatItem rightBorder descRight>
          <p>{player.stats.powerPlayGoals}</p>
          <p title={statHeaders.powerPlayGoals.title}>
            {statHeaders.powerPlayGoals.headerText}
          </p>
        </StatItem>
        <StatItem>
          <p title={statHeaders.powerPlayPoints.title}>
            {statHeaders.powerPlayPoints.headerText}
          </p>
          <p>{player.stats.powerPlayPoints}</p>
        </StatItem>
      </StatRow>
      <StatRow>
        <StatItem rightBorder descRight>
          <p>{player.stats.shortHandedGoals}</p>
          <p title={statHeaders.shortHandedGoals.title}>
            {statHeaders.shortHandedGoals.headerText}
          </p>
        </StatItem>
        <StatItem>
          <p title={statHeaders.shortHandedPoints.title}>
            {statHeaders.shortHandedPoints.headerText}
          </p>
          <p>{player.stats.shortHandedPoints}</p>
        </StatItem>
      </StatRow>
      <StatRow>
        <StatItem rightBorder descRight>
          <p>{player.stats.timeOnIcePerGame}</p>
          <p title={statHeaders.timeOnIcePerGame.title}>
            {statHeaders.timeOnIcePerGame.headerText}
          </p>
        </StatItem>
        <StatItem>
          <p title={statHeaders.faceOffsTaken.title}>
            {statHeaders.faceOffsTaken.headerText}
          </p>
          <p>{player.stats.faceOffsTaken}</p>
        </StatItem>
      </StatRow>
      <StatRow>
        <StatItem rightBorder descRight>
          <p>{player.stats.shots}</p>
          <p title={statHeaders.shots.title}>{statHeaders.shots.headerText}</p>
        </StatItem>
        <StatItem>
          <p title={statHeaders.hits.title}>{statHeaders.hits.headerText}</p>
          <p>{player.stats.hits}</p>
        </StatItem>
      </StatRow>
      <StatRow>
        <StatItem rightBorder descRight>
          <p>{player.stats.takeaways}</p>
          <p title={statHeaders.takeaways.title}>
            {statHeaders.takeaways.headerText}
          </p>
        </StatItem>
        <StatItem>
          <p title={statHeaders.giveaways.title}>
            {statHeaders.giveaways.headerText}
          </p>
          <p>{player.stats.giveaways}</p>
        </StatItem>
      </StatRow>
      <StatRow last>
        <StatItem rightBorder descRight>
          <p>{player.stats.blocked}</p>
          <p title={statHeaders.blocks.title}>
            {statHeaders.blocks.headerText}
          </p>
        </StatItem>
      </StatRow>
      <FlipDiv onClick={handleCardFlip} />
    </Container>
  )
}

export default PlayerCardBack
