import React from 'react'
import { withRouter } from 'react-router-dom'
import Media from 'react-media'
import styled from 'styled-components'
import NavList from './NavList'
import SearchField from '../search/SearchField'
import breakpoints from '../../styles/breakpoints'
import colors from '../../styles/colors'
import { naviItems } from '../../utils/'

const Container = styled.div`
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
    width: 100%;
  }
`

const mainNaviItems = ['players', 'teams', 'contact', 'search']

const userActionItems = [
  'login',
  'loginNav',
  'signup',
  'signupNav',
  'profile',
  'logout',
]

const createNaviItems = items => items.map(item => naviItems[item])

const NavContainerNoRouter = ({ location }) => {
  const isSearchPage = location.pathname === '/search'

  return (
    <Container data-cy='nav-container'>
      <NavList items={createNaviItems(mainNaviItems)} />
      <Media query={breakpoints.showSearchField}>
        {matches => matches && !isSearchPage && <SearchField />}
      </Media>
      <NavList items={createNaviItems(userActionItems)} right />
    </Container>
  )
}

export default withRouter(NavContainerNoRouter)
