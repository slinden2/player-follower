import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'
import { NavContext } from '../../contexts/NavContext'

const activeNavHighlight = css`
  content: '';
  display: block;
  height: 5px;
  background-color: ${colors.blue1};
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(0, 1);
`

const StyledNavListItem = styled.li`
  text-transform: uppercase;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  margin-left: 1rem;
  opacity: 0;
  transition: opacity 150ms ease-in-out;
  display: ${props => (!props.hideOnMobile ? 'block' : 'none')};
  cursor: pointer;

  @media ${breakpoints.showDesktopNavi} {
    opacity: 1;
    margin: 0;
    height: 100%;
    display: none;
    display: ${props => (!props.hideOnDesktop ? 'flex' : 'none')};
    align-items: center;
    font-size: 1rem;
    border-left: 1px solid ${colors.grey2};
    border-right: 1px solid ${colors.grey2};
    margin: -1px 0 0 -1px; /* makes adjacent borders collapse */
    position: relative;

    &:hover {
      background-color: ${colors.grey2};
    }

    &::before {
      all: unset;
      ${activeNavHighlight}
    }

    &:hover::before {
      transform: scale(1, 1);
      transition: transform ease-in-out 250ms;
    }
  }

  @media ${breakpoints.showSearchField} {
    display: ${props =>
      props.hideWithSearch || props.hideOnDesktop ? 'none' : 'flex'};
  }
`

const linkStyling = css`
  display: flex;
  align-items: center;
  height: 100%;
`

const StyledNavLink = styled(NavLink)`
  @media ${breakpoints.showDesktopNavi} {
    ${linkStyling}
    padding: 0.75rem;

    &::before {
      ${activeNavHighlight}
    }

    &.active {
      background-color: ${colors.grey2};

      &::before {
        transform: scale(1, 1);
      }
    }
  }
`

const NavItemNoLink = styled.span`
  ${linkStyling}
  @media ${breakpoints.showDesktopNavi} {
    padding: 0.75rem;
  }
`

const NavListItem = ({
  exact,
  to,
  name,
  username,
  hideWithSearch,
  hideOnMobile,
  hideOnDesktop,
  onClick,
}) => {
  const { dropdownBg } = useContext(NavContext)

  const handleEnter = event => {
    dropdownBg.classList.add('open')

    const liElement = event.currentTarget

    const coords = {
      width: liElement.getBoundingClientRect().width,
      height: liElement.getBoundingClientRect().height,
      left: liElement.getBoundingClientRect().left,
      top: liElement.getBoundingClientRect().bottom,
    }

    dropdownBg.style.setProperty('width', `${coords.width}px`)
    dropdownBg.style.setProperty('height', `${coords.height}px`)
    dropdownBg.style.setProperty(
      'transform',
      `translate(${coords.left}px, ${coords.top}px`
    )
  }

  const handleLeave = event => {
    dropdownBg.classList.remove('open')
  }

  const linkProps = { exact, to }

  const nameToShow = name !== 'profile' ? name : username

  // Closure for onClick so that we can pass name for modal type to it
  const newOnClick = onClick ? () => onClick(name) : null

  return (
    <StyledNavListItem
      onClick={newOnClick}
      hideWithSearch={hideWithSearch}
      hideOnMobile={hideOnMobile}
      hideOnDesktop={hideOnDesktop}
      onMouseEnter={dropdownBg && handleEnter}
      onMouseLeave={dropdownBg && handleLeave}
    >
      {to ? (
        <StyledNavLink {...linkProps}>{nameToShow}</StyledNavLink>
      ) : (
        <NavItemNoLink>{nameToShow}</NavItemNoLink>
      )}
    </StyledNavListItem>
  )
}

export default NavListItem
