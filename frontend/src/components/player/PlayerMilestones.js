import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import styled, { css } from 'styled-components'
import { PLAYER_MILESTONES } from '../../graphql/queries'
import Button from '../elements/Button'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'
import Loader from '../elements/Loader'
import PlayerVideo from './PlayerVideo'
import { formatDate } from '../../utils'

const textPropOnDesktop = css`
  @media ${breakpoints.showDesktopNavi} {
    text-align: center;
  }
`

const Container = styled.div`
  width: 100%;
`

const HighlightsHeader = styled.div`
  font-size: 1.25rem;
  font-weight: bolder;
  margin-bottom: 10px;

  ${textPropOnDesktop}
`

const MilestoneContainer = styled.div`
  &::after {
    content: '';
    height: 3px;
    background-color: ${colors.grey3};
    width: 100%;
    display: block;
    margin: 10px 0;
  }
`

const MilestoneHeader = styled.div`
  margin: 0;
  font-weight: bolder;

  ${textPropOnDesktop}
`

const MilestoneDate = styled.div`
  margin: 0;

  ${textPropOnDesktop}
`

const MilestoneDescription = styled.div`
  font-size: 0.875rem;
  max-width: 640px;
  margin: 0 auto;
`

const getDate = (gamePk, boxscores) => {
  const score = boxscores.find(boxscore => boxscore.gamePk === gamePk)
  return score.gameDate
}

const PlayerMilestones = ({
  playerId,
  fullName,
  gamePks,
  selectedGamePk,
  setSelectedGamePk,
  boxscores,
}) => {
  const { data, loading } = useQuery(PLAYER_MILESTONES, {
    variables: { playerId, gamePks: selectedGamePk || gamePks },
  })

  if (loading) {
    return <Loader />
  }

  const milestones = data.GetMilestones.filter(milestone => milestone.length)

  const createMilestones = () =>
    milestones.map(game =>
      game.map(milestone => (
        <MilestoneContainer key={milestone.title}>
          <MilestoneHeader>{milestone.title}</MilestoneHeader>
          <MilestoneDate>
            {formatDate(getDate(milestone.gamePk, boxscores))}{' '}
            {milestone.blurb.split(':')[0]}
          </MilestoneDate>
          <PlayerVideo
            fullName={fullName} // tracking purposes
            date={getDate(milestone.gamePk, boxscores)} // tracking purposes
            width={milestone.playback.width}
            height={milestone.playback.height}
            url={milestone.playback.url}
          />
          <MilestoneDescription>{milestone.description}</MilestoneDescription>
        </MilestoneContainer>
      ))
    )

  return (
    <Container>
      <HighlightsHeader>
        Highlights{' '}
        {selectedGamePk ? (
          <Button
            onClick={() => setSelectedGamePk(null)}
            color={colors.blue1}
            content="Last 5 games"
          />
        ) : (
          '| Last 5 games'
        )}{' '}
      </HighlightsHeader>
      {createMilestones()}
    </Container>
  )
}

export default PlayerMilestones
