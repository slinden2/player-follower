import React, { useContext } from 'react'
import styled from 'styled-components'
import { naviItems } from '../../utils'
import DropdownItem from './DropdownItem'
import { NavContext } from '../../contexts/NavContext'

const Container = styled.ul`
  list-style: none;
  padding-left: 0;
  z-index: 1005;
  opacity: 0;
  position: absolute;
  overflow: hidden;
  padding: 20px 20px 20px 10px;
  transition: all 0.2s;
  will-change: opacity;
  display: none;
  cursor: initial;

  ${({ initialPos }) => initialPos && `top: ${initialPos.top - 5}px`}

  &.trigger-enter {
    display: block;
  }

  &.trigger-enter-active {
    opacity: 1;
  }
`

const DropdownList = React.forwardRef(({ items }, ref) => {
  const { initialPos } = useContext(NavContext)

  const links = items.map(item => naviItems[item])
  return (
    <Container ref={ref} initialPos={initialPos}>
      {links && links.map(link => <DropdownItem key={link.name} data={link} />)}
    </Container>
  )
})

export default DropdownList
