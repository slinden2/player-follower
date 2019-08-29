import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import styled, { css } from 'styled-components'
import { PLAYER_MILESTONES } from '../../graphql/queries'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'

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

const VideoContainer = styled.div``

const Video = styled.video`
  height: 100%;
  max-width: 100%;
  display: block;
  margin: 5px auto;
`

const MilestoneDescription = styled.div`
  font-size: 0.875rem;
  max-width: 640px;
  margin: 0 auto;
`

const Button = styled.button`
  background-color: ${colors.blue1};
  border: 0;
  border-radius: 10px;
  padding: 5px;
  text-shadow: 1px 1px ${colors.grey3};

  &:hover {
    font-weight: bolder;
    cursor: pointer;
  }
`

const getDate = (gamePk, boxscores) => {
  const score = boxscores.find(boxscore => boxscore.gamePk === gamePk)
  return score.gameDate
}

const PlayerMilestones = ({
  playerId,
  gamePks,
  selectedGamePk,
  setSelectedGamePk,
  boxscores,
}) => {
  const { data, loading } = useQuery(PLAYER_MILESTONES, {
    variables: { playerId, gamePks: selectedGamePk || gamePks },
  })

  if (loading) {
    return <div>Loading...</div>
  }

  const milestones = data.GetMilestones.filter(milestone => milestone.length)

  const createMilestones = () =>
    milestones.map(game =>
      game.map(milestone => (
        <MilestoneContainer key={milestone.title}>
          <MilestoneHeader>{milestone.title}</MilestoneHeader>
          <MilestoneDate>
            {getDate(milestone.gamePk, boxscores)}{' '}
            {milestone.blurb.split(':')[0]}
          </MilestoneDate>
          <VideoContainer>
            <Video
              width={milestone.playback.width}
              height={milestone.playback.height}
              controls
            >
              <source src={milestone.playback.url} />
            </Video>
          </VideoContainer>
          <MilestoneDescription>{milestone.description}</MilestoneDescription>
        </MilestoneContainer>
      ))
    )

  return (
    <Container>
      <HighlightsHeader>
        Highlights{' '}
        {selectedGamePk ? (
          <Button onClick={() => setSelectedGamePk(null)}>Last 5 games</Button>
        ) : (
          '| Last 5 games'
        )}{' '}
      </HighlightsHeader>
      {createMilestones()}
    </Container>
  )
}

export default PlayerMilestones
