import React, { useContext } from 'react'
import Media from 'react-media'
import { Link, NavLink, withRouter } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { NotificationContext } from '../../contexts/NotificationContext'
import SearchField from './SearchField'
import styled from 'styled-components'
import colors from '../../styles/colors'
import variables from '../../styles/variables'
import breakpoints from '../../styles/breakpoints'

const Container = styled.header`
  background-color: ${colors.grey1};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: ${variables.navHeight}px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media ${breakpoints.showDesktopNavi} {
    display: grid;
    box-sizing: content-box;
    grid-template-columns: 270px 1fr;
    border-bottom: 2px solid ${colors.grey2};
    border-top: 2px solid ${colors.grey2};
  }
`

const NavSearchContainer = styled.div`
  grid-column: 2 / 2;
  height: 100%;
  display: flex;
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

  @media ${breakpoints.showDesktopNavi} {
    all: unset;
    display: flex;
    flex-direction: column;
    height: 100%;
    ${props => props.right && 'margin-left: auto'}
  }
`

const NavList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  @media ${breakpoints.showDesktopNavi} {
    flex: 1;
    display: flex;
    align-items: center;
  }
`

const NavButton = styled.div`
  white-space: nowrap;

  @media ${breakpoints.showDesktopNavi} {
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 1em;
    padding-right: 1em;
  }
`

const UserDropDown = styled.div`
  position: absolute;
  top: 100%;
  left: -100%;
  right: 0;
  z-index: 998;
  padding: 10px;
  background-color: ${colors.grey1};
  border: 2px solid ${colors.grey3};
  display: none;
`

const DropDownList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`

const DropDownListItem = styled.li`
  margin-bottom: 0.75rem;

  & span {
    font-size: 0.75rem;
  }
`

const DropDownLink = styled(Link)`
  &:hover {
    font-weight: bolder;
  }
`

const LogOutButton = styled.div`
  background-color: ${colors.red1};
  border: 1px solid ${colors.red1};
  border-radius: 5px;
  padding: 5px;
  box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.75);
  cursor: pointer;
  display: inline-block;
`

const NavListItem = styled.li`
  margin-bottom: 1em;
  margin-left: 1em;
  text-transform: uppercase;
  font-size: 1.25rem;
  cursor: ${props => !props.nopointer && 'pointer'};
  position: ${props =>
    props.divider === 'true' || props.user === 'true' ? 'relative' : ''};

  &::before {
    content: '';
    position: ${props => (props.divider === 'true' ? 'absolute' : '')};
    bottom: 1.875rem;
    left: 0;
    height: 5px;
    width: 95%;
    border-radius: 2px;
    background-color: ${colors.grey2};
  }

  & span {
    font-size: 1rem;
  }

  @media ${breakpoints.showDesktopNavi} {
    margin: 0;
    ${props => props.right && 'margin-left: auto'}
    height: 100%;
    font-size: 1rem;
    border-left: 1px solid ${colors.grey2};
    border-right: 1px solid ${colors.grey2};

    &:hover {
      background-color: ${colors.grey2};
    }

    &::before {
      display: none;
    }

    & ${NavButton}:hover + ${UserDropDown} {
      display: block;
    }

    & ${UserDropDown}:hover {
      display: block;
    }
  }
`

const Logo = styled.div`
  font-size: 1.5rem;
  padding-left: 1em;

  @media ${breakpoints.showDesktopNavi} {
    grid-column: 1 / 1;
    padding: 0 1em;
  }
`

const actionHighlightMobile = `
  background-color: ${colors.blue1};
  border: 1px solid ${colors.blue1};
  border-radius: 5px;
  padding: 5px;
  box-shadow: 2px 2px 3px 0px rgba(0,0,0,0.75);
`

const actionHighlightDesktop = `
  border: 0;
  border-radius: 0;
  padding: 0;
  box-shadow: 0 0 0 0;
`

const StyledNavLink = styled(NavLink)`
  opacity: 0;
  transition: opacity 150ms ease-in-out;
  ${props => (props.highlight === 'true' ? `${actionHighlightMobile}` : '')};

  @media ${breakpoints.showDesktopNavi} {
    ${props => (props.highlight === 'true' ? `${actionHighlightDesktop}` : '')};
    opacity: 1;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 1em;
    padding-right: 1em;
    position: relative;
    white-space: nowrap;

    &::before {
      content: '';
      display: block;
      height: 5px;
      background-color: ${props =>
        props.highlight === 'true' ? colors.grey1 : colors.blue1};
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      transform: scale(0, 1);
    }

    &:hover::before {
      transform: scale(1, 1);
      transition: transform ease-in-out 250ms;
    }

    &.active {
      background-color: ${props =>
        props.highlight === 'true' ? colors.blue1 : colors.grey2};

      &::before {
        transform: scale(1, 1);
      }
    }
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

  @media ${breakpoints.showDesktopNavi} {
    display: none;
  }
`

const NavItem = ({ name, exact, to, highlight, divider }) => {
  const newName = name[0].toUpperCase() + name.slice(1)

  const listProps = {
    highlight: highlight ? 'true' : 'false',
    divider: divider ? 'true' : 'false',
  }
  const linkProps = { highlight: highlight ? 'true' : 'false' }

  return (
    <NavListItem {...listProps}>
      <StyledNavLink exact={exact} to={to} {...linkProps}>
        {newName}
      </StyledNavLink>
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

  const renderUserActions = () =>
    !token ? (
      <>
        <NavItem to="/login" name="log in" divider />
        <NavItem to="/signup" name="sign up" highlight />
      </>
    ) : (
      <>
        <Media query={breakpoints.showDesktopNavi}>
          {matches =>
            matches ? (
              // Render desktop logged user navi
              <NavListItem user="true" nopointer>
                <NavButton>USER</NavButton>
                <UserDropDown className="dropdown">
                  <DropDownList>
                    <DropDownListItem>
                      <span>{user.data.me && user.data.me.username}</span>
                    </DropDownListItem>
                    <DropDownListItem>
                      <DropDownLink to="/profile" name="profile">
                        Profile
                      </DropDownLink>
                    </DropDownListItem>
                    <DropDownListItem>
                      <LogOutButton onClick={handleLogout}>
                        Log Out
                      </LogOutButton>
                    </DropDownListItem>
                  </DropDownList>
                </UserDropDown>
              </NavListItem>
            ) : (
              // Render mobile logged user navi
              <>
                <NavListItem divider="true" nopointer>
                  <span>{user.data.me && user.data.me.username}</span>
                </NavListItem>
                <NavItem to="/profile" name="profile" />
                <NavListItem>
                  <LogOutButton onClick={handleLogout}>Log Out</LogOutButton>
                </NavListItem>
              </>
            )
          }
        </Media>
      </>
    )

  return (
    <Container>
      <Logo>PLAYER FOLLOWER</Logo>
      <NavSearchContainer>
        <ToggleLabel htmlFor="toggle-checkbox">
          <span />
        </ToggleLabel>
        <ToggleCheckbox type="checkbox" id="toggle-checkbox" />
        <NavContainer>
          <NavList>
            <NavItem exact to="/" name="Players" />
            {token && <NavItem to="/favorites" name="favorites" />}
            <NavItem to="/stats" name="stats" />
            <NavItem to="/standings" name="standings" />
            <NavItem to="/about" name="about" />
            {/* If search field is not shown, render a link for search page */}
            <Media query={`${breakpoints.showSearchField}`}>
              {matches =>
                !matches && <NavItem to="/find-players" name="search" />
              }
            </Media>
            <Media query={breakpoints.showDesktopNavi}>
              {matches => !matches && renderUserActions()}
            </Media>
          </NavList>
        </NavContainer>
        <Media query={`${breakpoints.showSearchField}`}>
          {matches => matches && <SearchField />}
        </Media>
        {/* Render user action to the right of the nav bar if desktop navi is shown */}
        <Media query={breakpoints.showDesktopNavi}>
          {matches =>
            matches && (
              <NavContainer right>
                <NavList>{renderUserActions()}</NavList>
              </NavContainer>
            )
          }
        </Media>
      </NavSearchContainer>
    </Container>
  )
}

export default withRouter(TopNavBarNoRouter)
