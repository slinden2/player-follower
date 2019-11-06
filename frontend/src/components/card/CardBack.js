import React from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { statHeaders, sortByHighlight, teamStatHeaders } from '../../utils'
import FlipDiv from './FlipDiv'
import colors from '../../styles/colors'
import { BackContainer } from './styles'

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

const PlayerCardBack = ({
  context,
  data,
  isFlipped,
  handleCardFlip,
  sortBy,
}) => {
  const contextSelector = {
    player: () => ({
      link: `/players/${data.player.siteLink}`,
      name: data.player.firstName + ' ' + data.player.lastName,
      stats: {
        statArray: [
          ['powerPlayGoals', 'powerPlayPoints'],
          ['shortHandedGoals', 'shortHandedPoints'],
          ['timeOnIcePerGame', 'faceOffsTaken'],
          ['shots', 'hits'],
          ['takeaways', 'giveaways'],
          ['blocked'],
        ],
        stats: data.stats,
        headers: statHeaders,
      },
      isHighlighted: stat => stat === sortByHighlight[sortBy],
    }),
    team: () => ({
      link: `/teams/${data.team.siteLink}`,
      name: data.team.name,
      stats: {
        statArray: [
          ['goalsFor', 'goalsAgainst'],
          ['powerPlayGoals', 'ppPct'],
          ['powerPlayOpportunitiesAllowed', 'pkPct'],
          ['shotsForPerGame', 'shotsAgainstPerGame'],
          ['takeaways', 'giveaways'],
          ['hitsForPerGame', 'hitsAgainstPerGame'],
        ],
        stats: data.stats,
        headers: teamStatHeaders,
      },
      isHighlighted: stat => stat === sortBy,
    }),
  }

  const curContext = contextSelector[context]()

  return (
    <BackContainer isFlipped={isFlipped}>
      <NameBar>
        <Link to={curContext.link}>{curContext.name}</Link>
      </NameBar>
      {curContext.stats.statArray.map((row, i) => (
        <StatRow first={!i} last={i + 1 === statArray.length} key={i}>
          {row.map((stat, i) => {
            const isRightCol = (i + 1) % 2
            return (
              <StatItem
                key={stat}
                isRightCol={isRightCol}
                isHighlighted={curContext.isHighlighted(stat)}
              >
                {isRightCol ? (
                  <>
                    <p>{curContext.stats.stats[stat]}</p>
                    <p title={curContext.stats.headers[stat].title}>
                      {curContext.stats.headers[stat].headerText}
                    </p>
                  </>
                ) : (
                  <>
                    <p title={curContext.stats.headers[stat].title}>
                      {curContext.stats.headers[stat].headerText}
                    </p>
                    <p>{curContext.stats.stats[stat]}</p>
                  </>
                )}
              </StatItem>
            )
          })}
        </StatRow>
      ))}
      <FlipDiv onClick={handleCardFlip} />
    </BackContainer>
  )
}

export default PlayerCardBack
