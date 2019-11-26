import React from 'react'
import styled from 'styled-components'
import PlayerVideo from './PlayerVideo'

const Container = styled.div``

const Title = styled.p`
  font-size: 1.25rem;
  font-weight: bolder;
  line-height: 1rem;
`

const Description = styled.p`
  font-size: 1.125rem;
  line-height: 1rem;
`

const ScoreData = styled.div`
  font-size: 1rem;
  line-height: 1rem;
`

export const PlayerMilestone = ({ data, title, description, scoreText }) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <ScoreData>{scoreText}</ScoreData>
      <PlayerVideo
        lastName={data.scorer.lastName}
        date={data.gameDate}
        width={data.highlight.width}
        height={data.highlight.height}
        url={data.highlight.url}
      />
    </Container>
  )
}
