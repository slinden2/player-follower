import React, { useState } from 'react'
import { Link, Route } from 'react-router-dom'
import { Segment, Menu } from 'semantic-ui-react'
import * as S from '../styles'

const TopNavBar = () => {
  const [activeItem, setActiveItem] = useState('all')

  const handleItemClick = (e, { name }) => setActiveItem(name)

  return (
    <Segment inverted>
      <Menu inverted pointing secondary>
        <Menu.Item
          as={Link}
          to="/"
          name="all"
          active={activeItem === 'all'}
          onClick={handleItemClick}
        />
        <Menu.Item
          as={Link}
          to="/stats"
          name="stats"
          active={activeItem === 'stats'}
          onClick={handleItemClick}
        />
        <Menu.Item
          as={Link}
          to="standings"
          name="standings"
          active={activeItem === 'standings'}
          onClick={handleItemClick}
        />
        <Menu.Item
          as={Link}
          to="/about"
          name="about"
          active={activeItem === 'about'}
          onClick={handleItemClick}
        />
        <Menu.Menu position="right">
          <Menu.Item
            as={Link}
            to="/login"
            name="login"
            active={activeItem === 'login'}
            onClick={handleItemClick}
          />
        </Menu.Menu>
      </Menu>
    </Segment>
  )
}

export default TopNavBar
