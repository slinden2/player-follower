import React from 'react'
import styled from 'styled-components'

const Container = styled.div``

const Title = styled.h1`
  text-align: ${props => (props.center ? 'center' : 'left')};
`

const PageContainer = ({ children, title, center }) => {
  return (
    <Container>
      <Title center={center}>{title}</Title>
      {children}
    </Container>
  )
}

export default PageContainer
