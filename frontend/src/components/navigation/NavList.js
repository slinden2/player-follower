import React, { useContext } from 'react'
import styled from 'styled-components'
import NavListItem from './NavListItem'
import breakpoints from '../../styles/breakpoints'
import { AuthContext } from '../../contexts/AuthContext'

const Container = styled.nav`
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
  const { token, logoutUser, user } = useContext(AuthContext)

  const functionMap = {
    handleLogout: {
      onClick: logoutUser,
    },
  }

  let username

  if (user.data.me) username = user.data.me.username

  const showNavItem = item =>
    (!(item.noToken && token) && !item.tokenRequired) ||
    (item.tokenRequired && token)

  const createItems = () => {
    const navItems = items.map(
      item =>
        showNavItem(item) && (
          <NavListItem
            key={item.name}
            {...item}
            {...functionMap[item.bindTo]}
            username={username}
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