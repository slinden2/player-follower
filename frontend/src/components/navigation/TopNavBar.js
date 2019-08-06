import React, { useContext } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { NotificationContext } from '../../contexts/NotificationContext'
import SearchField from './SearchField'
import styled from 'styled-components'
import colors from '../../styles/colors'
import variables from '../../styles/variables'

const Container = styled.header`
  background-color: ${colors.grey1};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: ${variables.navHeight};
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 800px) {
    display: grid;
    box-sizing: content-box;
    grid-template-columns: auto 1fr;
    border: 2px solid ${colors.grey2};
  }
`

const NavContainer = styled.nav`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: ${colors.grey1};
  transform: scale(1, 0);
  transform-origin: top;
  transition: transform 400ms ease-in-out;

  @media screen and (min-width: 800px) {
    all: unset;
    grid-column: 2 / 2;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`

const NavList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  @media screen and (min-width: 800px) {
    flex: 1;
    display: flex;
    /* border: 1px solid red; */
    align-items: center;
  }
`

const NavListItem = styled.li`
  margin-bottom: 1em;
  margin-left: 1em;
  text-transform: uppercase;
  font-size: 1.25rem;
  cursor: pointer;

  @media screen and (min-width: 800px) {
    margin: 0;
    height: 100%;
    font-size: 1rem;
    border-left: 1px solid ${colors.grey2};
    border-right: 1px solid ${colors.grey2};

    &:hover {
      background-color: ${colors.grey2};
    }
  }
`

const Logo = styled.div`
  font-size: 1.5rem;
  padding-left: 1em;

  @media screen and (min-width: 800px) {
    grid-column: 1 / 1;
    padding: 0 1em;
  }
`

const StyledLink = styled(NavLink)`
  opacity: 0;
  transition: opacity 150ms ease-in-out;

  @media screen and (min-width: 800px) {
    opacity: 1;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 1em;
    padding-right: 1em;

    &.active {
      background-color: ${colors.grey2};
    }
  }
`

const NavButton = styled.div`
  @media screen and (min-width: 800px) {
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 1em;
    padding-right: 1em;
  }
`

const ToggleCheckbox = styled.input`
  display: none;

  &:checked ~ nav {
    transform: scale(1, 1);
  }

  &:checked ~ nav a {
    opacity: 1;
    transition: opacity 250ms ease-in-out 250ms;
  }
`

const ToggleLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  margin-left: 1em;
  height: 100%;
  display: flex;
  align-items: center;

  & span,
  span::before,
  span::after {
    display: block;
    width: 2em;
    background: ${colors.white1};
    height: 2px;
    border-radius: 2px;
    position: relative;
  }

  & span::before,
  span::after {
    content: '';
    position: absolute;
  }

  & span::before {
    bottom: 7px;
  }

  & span::after {
    top: 7px;
  }

  @media screen and (min-width: 800px) {
    display: none;
  }
`

const NavItem = ({ name, exact, to, position }) => {
  const newName = name[0].toUpperCase() + name.slice(1)

  return (
    <NavListItem>
      <StyledLink exact={exact} to={to}>
        {newName}
      </StyledLink>
    </NavListItem>
  )
}

const TopNavBarNoRouter = ({ history }) => {
  const { setNotification } = useContext(NotificationContext)
  const { user, token, logoutUser } = useContext(AuthContext)

  const handleLogout = () => {
    logoutUser()
    setNotification('positive', 'You have been logged out.')
    history.push('/')
  }

  return (
    <Container>
      <Logo>PLAYER FOLLOWER</Logo>
      <ToggleCheckbox type="checkbox" id="toggle-checkbox" />
      <NavContainer>
        <NavList>
          <NavItem exact to="/" name="Players" />

          {token && <NavItem to="/favorites" name="favorites" />}
          <NavItem to="/stats" name="stats" />
          <NavItem to="/standings" name="standings" />
          <NavItem to="/about" name="about" />
          {!token ? (
            <>
              <NavItem to="/login" name="log in" />
              <NavItem to="/signup" name="sign up" />
            </>
          ) : (
            <>
              <NavListItem>
                <NavButton onClick={handleLogout}>Log Out</NavButton>
              </NavListItem>
            </>
          )}
        </NavList>
      </NavContainer>
      <ToggleLabel htmlFor="toggle-checkbox">
        <span />
      </ToggleLabel>
      {/* <SearchField /> */}
    </Container>
  )
}

export default withRouter(TopNavBarNoRouter)
