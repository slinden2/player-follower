import React, { useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Segment, Menu } from 'semantic-ui-react'
import { AuthContext } from '../contexts/AuthContext'
import { NotificationContext } from '../contexts/NotificationContext'

const TopNavBarNoRouter = ({ history, activePage, setActivePage }) => {
  const { setNotification } = useContext(NotificationContext)
  const { token, logoutUser } = useContext(AuthContext)
  const handleItemClick = (e, { name }) => setActivePage(name)

  const handleLogout = () => {
    logoutUser()
    setNotification('positive', 'You have been logged out.')
    history.push('/')
  }

  return (
    <Segment inverted>
      <Menu inverted pointing secondary>
        <Menu.Item
          as={Link}
          to="/"
          name="all"
          active={activePage === 'all'}
          onClick={handleItemClick}
        />
        {token && (
          <Menu.Item
            as={Link}
            to="/favorites"
            name="favorites"
            active={activePage === 'favorites'}
            onClick={handleItemClick}
          />
        )}
        <Menu.Item
          as={Link}
          to="/stats"
          name="stats"
          active={activePage === 'stats'}
          onClick={handleItemClick}
        />
        <Menu.Item
          as={Link}
          to="standings"
          name="standings"
          active={activePage === 'standings'}
          onClick={handleItemClick}
        />
        <Menu.Item
          as={Link}
          to="/about"
          name="about"
          active={activePage === 'about'}
          onClick={handleItemClick}
        />
        {!token ? (
          <>
            <Menu.Menu position="right">
              <Menu.Item
                as={Link}
                to="/login"
                name="log in"
                active={activePage === 'log in'}
                onClick={handleItemClick}
              />
            </Menu.Menu>
            <Menu.Menu>
              <Menu.Item
                as={Link}
                to="/signup"
                name="sign up"
                active={activePage === 'sign up'}
                onClick={handleItemClick}
              />
            </Menu.Menu>
          </>
        ) : (
          <>
            <Menu.Menu position="right">
              <Menu.Item
                as={Link}
                to="/profile"
                name="profile"
                active={activePage === 'profile'}
                onClick={handleItemClick}
              />
            </Menu.Menu>
            <Menu.Menu>
              <Menu.Item name="log out" onClick={handleLogout} />
            </Menu.Menu>
          </>
        )}
      </Menu>
    </Segment>
  )
}

export default withRouter(TopNavBarNoRouter)
