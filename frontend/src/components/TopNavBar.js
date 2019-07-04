import React, { useContext } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { Segment, Menu, Label } from 'semantic-ui-react'
import { AuthContext } from '../contexts/AuthContext'
import { NotificationContext } from '../contexts/NotificationContext'

const TopNavBarNoRouter = ({ history }) => {
  const { setNotification } = useContext(NotificationContext)
  const { user, token, logoutUser } = useContext(AuthContext)

  const handleLogout = () => {
    logoutUser()
    setNotification('positive', 'You have been logged out.')
    history.push('/')
  }

  return (
    <Segment inverted>
      <Menu inverted pointing secondary>
        <Menu.Item as={NavLink} exact to="/" name="all" />
        {token && <Menu.Item as={NavLink} to="/favorites" name="favorites" />}
        <Menu.Item as={NavLink} to="/stats" name="stats" />
        <Menu.Item as={NavLink} to="/standings" name="standings" />
        <Menu.Item as={NavLink} to="/about" name="about" />
        {!token ? (
          <>
            <Menu.Menu position="right">
              <Menu.Item as={NavLink} to="/login" name="log in" />
            </Menu.Menu>
            <Menu.Menu>
              <Menu.Item as={NavLink} to="/signup" name="sign up" />
            </Menu.Menu>
          </>
        ) : (
          <>
            <Menu.Menu position="right">
              {/* <Menu.Item
                as={NavLink}
                to="/profile"
                name="profile"
                
                
              /> */}
              {user.data.me && (
                <Label
                  as={NavLink}
                  to="/profile"
                  circular
                  style={{ margin: 'auto auto' }}
                  size="medium"
                  content={user.data.me.username}
                />
              )}
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
