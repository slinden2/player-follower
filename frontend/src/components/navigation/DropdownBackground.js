import React, { useContext, useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { NavContext } from '../../contexts/NavContext'
import colors from '../../styles/colors'

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  transition: all 0.3s, opacity 0.1s, translate 0.2s;
  opacity: 0;

  ${({ initialPos }) =>
    initialPos &&
    `transform: translate(${initialPos.left}px, ${initialPos.top}px);`}

  &.open {
    opacity: 1;
  }
`

const Container = styled.div`
  background-color: ${colors.grey1};
  border: 3px solid ${colors.grey3};
  border-radius: 5px;
  position: relative;
  height: inherit;
`

const Arrow = styled.div`
  height: 16px;
  width: 16px;
  transform: rotate(45deg);
  position: absolute;
  z-index: -1;
  left: 50%;
  top: 0;
  margin-left: -8px;
  margin-top: -8px;
  background-color: ${colors.grey3};
`

const DropdownBackground = () => {
  const { setDropdownBg, initialPos } = useContext(NavContext)
  const bgRef = useRef(null)

  useEffect(() => {
    setDropdownBg(bgRef.current)
  }, [])

  return (
    <Wrapper ref={bgRef} initialPos={initialPos}>
      <Container />
      <Arrow />
    </Wrapper>
  )
}

export default DropdownBackground
