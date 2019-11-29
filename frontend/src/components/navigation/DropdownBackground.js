import React, { useContext, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { NavContext } from '../../contexts/NavContext'
import colors from '../../styles/colors'

const Container = styled.div`
  background-color: ${colors.grey1};
  border: 3px solid red;
  position: absolute;
  width: 100px;
  height: 100px;
  display: flex;
  transition: all 0.3s, opacity 0.1s, translate 0.2s;
  opacity: 0;

  &.open {
    opacity: 1;
  }
`

const DropdownBackground = () => {
  const { setDropdownBg } = useContext(NavContext)
  const bgRef = useRef(null)

  useEffect(() => {
    setDropdownBg(bgRef.current)
  }, [])

  return <Container ref={bgRef} />
}

export default DropdownBackground
