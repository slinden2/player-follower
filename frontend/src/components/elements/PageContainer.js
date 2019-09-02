import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const Container = styled.div`
  background: ${colors.grey2};
  padding: 1px 10px 10px 10px;
  border-radius: 10px;
`

const Title = styled.h2`
  text-align: center;
`

const PageContainer = ({ children, title }) => {
  return (
    <Container>
      <Title>{title}</Title>
      {children}
    </Container>
  )
}

export default PageContainer
