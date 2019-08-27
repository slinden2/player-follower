import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Media from 'react-media'
import NavContainer from './NavContainer'
import HamburgerToggle from './HamburgerToggle'
import SearchField from './SearchField'
import colors from '../../styles/colors'
import variables from '../../styles/variables'
import breakpoints from '../../styles/breakpoints'
import { naviItems } from '../../utils/'

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
    justify-content: flex-start;
    border-bottom: 2px solid ${colors.grey2};
    border-top: 2px solid ${colors.grey2};
  }
`

const Logo = styled.div`
  flex: none;
  font-size: 1.5rem;
  padding-left: 1em;
  text-transform: uppercase;

  @media ${breakpoints.showDesktopNavi} {
    grid-column: 1 / 1;
    padding: 0 1em;
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
  transform: scale(1, 0);
  transform-origin: top;
  transition: transform 400ms ease-in-out;
`

const DropDownList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  opacity: 0;
  transition: opacity 150ms ease-in-out;
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

const dropDownAnimation = `
  transform: scale(1, 1);

  & ${DropDownList} {
    opacity: 1;
    transition: opacity 150ms ease-in-out 250ms;
  }
`

const mainNaviItems = [
  'players',
  'favorites',
  'stats',
  'standings',
  'about',
  'search',
]

const userActionItems = ['login', 'signup', 'logout']

const createNaviItems = items => items.map(item => naviItems[item])

const Navigation = () => {
  return (
    <Container>
      <Logo>Player Follower</Logo>
      <HamburgerToggle />
      <NavContainer items={createNaviItems(mainNaviItems)} />
      <Media query={breakpoints.showSearchField}>
        {matches => matches && <SearchField />}
      </Media>
      <NavContainer items={createNaviItems(userActionItems)} right />
    </Container>
  )
}

export default Navigation
