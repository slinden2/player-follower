import React from 'react'
import styled from 'styled-components'
import PlayerVideo from './PlayerVideo'
import colors from '../../styles/colors'

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

const Source = styled.p`
  font-size: 0.875rem;
  margin-top: -5px;
  color: ${colors.grey5};

  & a {
    color: ${colors.grey5};
  }
`

export const PlayerMilestone = ({
  data,
  title,
  description,
  scoreText,
  source,
}) => {
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
      <Source>{source}</Source>
    </Container>
  )
}
