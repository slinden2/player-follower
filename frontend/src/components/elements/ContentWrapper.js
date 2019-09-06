import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 750px;
`

const ContentWrapper = ({ children }) => {
  return <Wrapper>{children}</Wrapper>
}

export default ContentWrapper
