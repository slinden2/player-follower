import React from 'react'
import styled from 'styled-components'

const Span = styled.span`
  cursor: pointer;
`

const ProtectedLink = () => {
  function createMailTo(e) {
    e.preventDefault()
    window.location = 'mailto:contact@player.fan'
  }

  return <Span onClick={createMailTo}>{'contact [at] player.fan'}</Span>
}

export default ProtectedLink
