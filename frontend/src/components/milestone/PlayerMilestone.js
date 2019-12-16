import React from 'react'
import styled from 'styled-components'
import MilestoneVideo from './MilestoneVideo'
import { VideoSource } from './VideoSource'
import { Title, Description } from './milestoneStyles'

const Container = styled.div``

const ScoreData = styled.div`
  font-size: 1rem;
  line-height: 1rem;
`

export const PlayerMilestone = ({
  data,
  title,
  description,
  scoreText,
  videoId,
}) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <ScoreData>{scoreText}</ScoreData>
      <MilestoneVideo
        trackingId={videoId}
        date={data.gameDate}
        width={data.highlight.width}
        height={data.highlight.height}
        url={data.highlight.url}
      />
      <VideoSource id={videoId} />
    </Container>
  )
}
