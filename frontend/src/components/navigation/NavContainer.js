import React, { useContext } from 'react'
import { NavLink, Link } from 'react-router-dom'
import styled from 'styled-components'
import Media from 'react-media'
import NavListItem from './NavListItem'
import colors from '../../styles/colors'
import variables from '../../styles/variables'
import breakpoints from '../../styles/breakpoints'
import { AuthContext } from '../../contexts/AuthContext'

const Container = styled.nav`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: ${colors.grey1};
  transform: scale(1, 0);
  transform-origin: top;
  transition: transform 300ms ease-in-out;

  @media ${breakpoints.showDesktopNavi} {
    all: unset;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    ${props => props.right && 'margin-left: auto'}
  }
`

const StyledNavList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  @media ${breakpoints.showDesktopNavi} {
    flex: 1;
    display: flex;
    align-items: center;
  }
`

const NavList = ({ items, right }) => {
  const { token, logoutUser } = useContext(AuthContext)

  const functionMap = {
    handleLogout: {
      onClick: logoutUser,
    },
  }

  const createItems = () => {
    const navItems = items.map(
      item =>
        ((!(item.noToken && token) && !item.tokenRequired) ||
          (item.tokenRequired && token)) && (
          <NavListItem
            key={item.name}
            {...item}
            {...functionMap[item.bindTo]}
          />
        )
    )

    return navItems
  }

  return (
    <Container right={right}>
      <StyledNavList>{createItems()}</StyledNavList>
    </Container>
  )
}

export default NavList
