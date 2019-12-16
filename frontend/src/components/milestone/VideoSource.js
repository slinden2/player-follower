import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const Container = styled.p`
  font-size: 0.875rem;
  margin-top: -5px;
  color: ${colors.grey5};

  & a {
    color: ${colors.grey5};
  }
`

export const VideoSource = ({ id }) => {
  const sourceLink = `https://www.nhl.com/video/c-${id}`

  return (
    <Container>
      {'Source: '}
      <a href={sourceLink} target='_blank' rel='noopener noreferrer'>
        {sourceLink}
      </a>
    </Container>
  )
}
