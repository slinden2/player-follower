import React from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { statHeaders, sortByHighlight } from '../../../utils'
import FlipDiv from './FlipDiv'
import colors from '../../../styles/colors'
import { commonStyles } from './playerCardStyles'

const Container = styled.div`
  ${commonStyles}

  transform: rotateY(180deg);

  ${({ isFlipped }) =>
    isFlipped &&
    css`
      transform: rotateY(0);
    `}
`

const NameBar = styled.div`
  background-color: ${colors.blue1};
  position: absolute;
  width: 100%;
  text-align: center;
  padding: 8px;
  top: 0;
  left: 0;
  font-size: 1.375rem;
  text-shadow: 1px 1px ${colors.grey2};
  border-radius: 10px 10px 0px 0px;
  border-bottom: 3px solid ${colors.grey2};
`

const StatRow = styled.div`
  margin-top: ${props => (props.first ? '45px' : '0px')};
  border-bottom: ${props => (props.last ? '3px' : '0px')} solid ${colors.grey2};
  text-shadow: 1px 1px ${colors.grey2};
`

const StatItem = styled.div`
  display: inline-block;
  width: 50%;
  padding: 5px 10px;
  border-right: ${props => (props.isRightCol ? '2px' : '0px')} solid
    ${colors.grey2};

  & p {
    width: 50%;
    display: inline-block;
    font-size: 1.125rem;
    margin: 0;

    ${({ isHighlighted }) =>
      isHighlighted &&
      css`
        font-weight: bold;
        text-decoration: underline;
      `}
  }

  & p:first-child {
    padding-right: 5px;
    text-align: ${props => (props.isRightCol ? 'center' : 'left')};
  }

  & p:last-child {
    padding-left: 5px;
    text-align: ${props => (props.isRightCol ? 'right' : 'center')};
  }
`

const statArray = [
  ['powerPlayGoals', 'powerPlayPoints'],
  ['shortHandedGoals', 'shortHandedPoints'],
  ['timeOnIcePerGame', 'faceOffsTaken'],
  ['shots', 'hits'],
  ['takeaways', 'giveaways'],
  ['blocked'],
]

const PlayerCardBack = ({ player, isFlipped, handleCardFlip, sortBy }) => {
  console.log(player)
  return (
    <Container isFlipped={isFlipped}>
      <NameBar>
        <Link to={`/players/${player.player.siteLink}`}>
          {player.player.firstName + ' ' + player.player.lastName}
        </Link>
      </NameBar>
      {statArray.map((row, i) => (
        <StatRow first={!i} last={i + 1 === statArray.length} key={i}>
          {row.map((stat, i) => {
            const isRightCol = (i + 1) % 2
            return (
              <StatItem
                key={stat}
                isRightCol={isRightCol}
                isHighlighted={stat === sortByHighlight[sortBy]}
              >
                {isRightCol ? (
                  <>
                    <p>{player.stats[stat]}</p>
                    <p title={statHeaders[stat].title}>
                      {statHeaders[stat].headerText}
                    </p>
                  </>
                ) : (
                  <>
                    <p title={statHeaders[stat].title}>
                      {statHeaders[stat].headerText}
                    </p>
                    <p>{player.stats[stat]}</p>
                  </>
                )}
              </StatItem>
            )
          })}
        </StatRow>
      ))}
      <FlipDiv onClick={handleCardFlip} />
    </Container>
  )
}

export default PlayerCardBack
