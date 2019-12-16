import React from 'react'
import styled from 'styled-components'
import { event } from '../../utils/tracking'

const VideoContainer = styled.div``

const Video = styled.video`
  max-height: ${({ height }) => height}px;
  max-width: 100%;
  display: block;
  margin: 5px auto;
`

const MilestoneVideo = ({ trackingId, date, width, height, url }) => {
  const handleOnPlay = () => {
    event('VIDEO', 'Play Video', `${trackingId} | ${date} | ${url}`)
  }

  return (
    <VideoContainer>
      <Video width={width} height={height} controls onPlay={handleOnPlay}>
        <source src={url} />
      </Video>
    </VideoContainer>
  )
}

export default MilestoneVideo
