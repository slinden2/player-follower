import React, { useContext, useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import DropdownList from './DropdownList'
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
    justify-content: center;
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
  dropdown,
  username,
  hideWithSearch,
  hideOnMobile,
  hideOnDesktop,
  onClick,
  ordinal,
  openedElement,
  setOpenedElement,
  openedLiElement,
  setOpenedLiElement,
}) => {
  const [dropdownList, setDropdownList] = useState(null)
  const dropdownRef = useRef(null)
  const liRef = useRef(null)
  const { dropdownBg, setInitialPos } = useContext(NavContext)

  const isOpen = liRef && liRef.current === openedLiElement

  useEffect(() => {
    setDropdownList(dropdownRef.current)
    // Only set initialPos with the first link of the nav
    if (ordinal === 0 && liRef.current.getBoundingClientRect().left !== 0) {
      setInitialPos({
        left: liRef.current.getBoundingClientRect().left,
        top: liRef.current.getBoundingClientRect().bottom,
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const hoverIsActive = dropdownList && dropdownBg

  const openDropdown = () => {
    dropdownList.classList.add('trigger-enter')
    setTimeout(
      () =>
        dropdownList.classList.contains('trigger-enter') &&
        dropdownList.classList.add('trigger-enter-active'),
      150
    )
  }

  const handleEnter = () => {
    openDropdown()

    dropdownBg.classList.add('open')

    const coords = {
      width: dropdownList.getBoundingClientRect().width,
      height: dropdownList.getBoundingClientRect().height,
      left: dropdownList.getBoundingClientRect().left,
      top: dropdownList.getBoundingClientRect().top + 10,
    }

    dropdownBg.style.setProperty('width', `${coords.width}px`)
    dropdownBg.style.setProperty('height', `${coords.height}px`)
    dropdownBg.style.setProperty(
      'transform',
      `translate(${coords.left}px, ${coords.top}px`
    )
  }

  const handleLeave = () => {
    dropdownList.classList.remove('trigger-enter', 'trigger-enter-active')
    dropdownBg.classList.remove('open')
  }

  const handleOpenDropdown = () => {
    // Inhibit functionality when desktop navigation is shown
    if (window.matchMedia(breakpoints.showDesktopNavi).matches) return

    // If a dropdown is already open, close it before opening the new one
    if (openedElement) {
      openedElement.classList.remove('trigger-enter', 'trigger-enter-active')
      setOpenedLiElement(false)
      setOpenedElement(false)
    }

    // Set newly opened dropdown ref in the state
    setOpenedElement(dropdownRef.current)
    setOpenedLiElement(liRef.current)
    openDropdown()
  }

  const closeDropdown = event => {
    if (event) {
      event.stopPropagation()
    }
    dropdownList.classList.remove('trigger-enter', 'trigger-enter-active')
    setOpenedLiElement(false)
  }

  const linkProps = { exact, to }

  const nameToShow = name !== 'profile' ? name : username

  // Closure for onClick so that we can pass name for modal type to it
  const newOnClick = onClick ? () => onClick(name) : null

  return (
    <StyledNavListItem
      ref={liRef}
      onClick={
        dropdown ? (isOpen ? closeDropdown : handleOpenDropdown) : newOnClick
      }
      hideWithSearch={hideWithSearch}
      hideOnMobile={hideOnMobile}
      hideOnDesktop={hideOnDesktop}
      onMouseEnter={hoverIsActive && handleEnter}
      onMouseLeave={hoverIsActive && handleLeave}
    >
      {to && !dropdown ? (
        <StyledNavLink {...linkProps}>{nameToShow}</StyledNavLink>
      ) : (
        <NavItemNoLink>{nameToShow}</NavItemNoLink>
      )}

      {dropdown && (
        <DropdownList
          ref={dropdownRef}
          items={dropdown}
          closeDropdown={closeDropdown}
        />
      )}
    </StyledNavListItem>
  )
}

export default NavListItem
