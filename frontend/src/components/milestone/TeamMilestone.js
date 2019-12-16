import React, { Fragment } from 'react'
import styled from 'styled-components'
import MilestoneVideo from './MilestoneVideo'
import { VideoSource } from './VideoSource'
import { Description, Title } from './milestoneStyles'

const Container = styled.div``

const TeamMilestone = props => {
  const { title, gameDate, condensed, recap } = props

  const videoArr = [condensed, recap]

  return (
    <Container>
      <Title>{title}</Title>
      {videoArr.map(item => (
        <Fragment key={item.playbackId}>
          <Description>{item.description}</Description>
          <MilestoneVideo
            trackingId={item.playbackId}
            date={gameDate}
            width={item.highlight.width}
            height={item.highlight.height}
            url={item.highlight.url}
          />
          <VideoSource id={item.playbackId} />
        </Fragment>
      ))}
    </Container>
  )
}

export default TeamMilestone
