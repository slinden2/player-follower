import React from 'react'
import styled from 'styled-components'

const STitle = styled.h2``

const Title = ({ children, dataCy }) => {
  return <STitle data-cy={dataCy}>{children}</STitle>
}

export default Title
