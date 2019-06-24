import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Segment, Menu } from 'semantic-ui-react'

const TopNavBar = ({ activePage, setActivePage, token, logout }) => {
  const handleItemClick = (e, { name }) => setActivePage(name)

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
          <Menu.Menu position="right">
            <Menu.Item name="log out" onClick={logout} />
          </Menu.Menu>
        )}
      </Menu>
    </Segment>
  )
}

export default TopNavBar
