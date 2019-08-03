import React, { useContext } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { NotificationContext } from '../../contexts/NotificationContext'
import SearchField from './SearchField'
import styled from 'styled-components'
import colors from '../../styles/colors'

const STopNavBar = styled.div`
  display: table;
  height: 100px;
  width: 100%;
  border-bottom: 3px solid ${colors.grey2};
  box-sizing: content-box;
`

const NavBaseStyling = `
  display: table-cell;
  vertical-align: middle;
  padding: 0 10px;
  border-left: 1px solid ${colors.grey2};
  border-right: 1px solid ${colors.grey2};
  min-width: 100px;
  text-align: center;
  height: 100%;
  margin: 0;
`

const Logo = styled.div`
  ${NavBaseStyling}
  font-size: 1.5rem;
`

const StyledLink = styled(NavLink)`
  ${NavBaseStyling}

  &.active {
    background: ${colors.grey2};
    font-weight: bolder;
    background-color: ${colors.blue1};
  }
`

const NavButton = styled.div`
  ${NavBaseStyling}
`

const NavItem = ({ name, exact, to, position }) => {
  const newName = name[0].toUpperCase() + name.slice(1)

  return (
    <StyledLink exact={exact} to={to}>
      {newName}
    </StyledLink>
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
    <STopNavBar>
      <Logo>PLAYER FOLLOWER</Logo>
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
          <NavButton onClick={handleLogout}>Log Out</NavButton>
        </>
      )}
      <SearchField />
    </STopNavBar>
  )
}

export default withRouter(TopNavBarNoRouter)
