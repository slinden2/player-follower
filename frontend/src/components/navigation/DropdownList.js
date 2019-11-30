import React, { useContext } from 'react'
import styled from 'styled-components'
import { naviItems, showNavItem } from '../../utils'
import DropdownItem from './DropdownItem'
import { NavContext } from '../../contexts/NavContext'
import { AuthContext } from '../../contexts/AuthContext'
import breakpoints from '../../styles/breakpoints'

const Container = styled.ul`
  list-style: none;
  padding-left: 0;

  @media ${breakpoints.showDesktopNavi} {
    z-index: 1005;
    opacity: 0;
    position: absolute;
    overflow: hidden;
    padding: 20px;
    transition: all 0.2s;
    will-change: opacity;
    display: none;
    cursor: initial;
    white-space: nowrap;

    ${({ initialPos }) => initialPos && `top: ${initialPos.top - 5}px`}

    &.trigger-enter {
      display: block;
    }

    &.trigger-enter-active {
      opacity: 1;
    }
  }
`

const DropdownList = React.forwardRef(({ items }, ref) => {
  const { token } = useContext(AuthContext)
  const { initialPos } = useContext(NavContext)

  const dropdownItems = items.map(item => naviItems[item])
  return (
    <Container ref={ref} initialPos={initialPos}>
      {dropdownItems &&
        dropdownItems.map(item => {
          // If user is not logged in don't show certain items
          if (!showNavItem(item, token)) return null
          const name = item.dropdownName ? item.dropdownName : item.name
          const link = item.to

          return <DropdownItem key={item.name} name={name} link={link} />
        })}
    </Container>
  )
})

export default DropdownList
