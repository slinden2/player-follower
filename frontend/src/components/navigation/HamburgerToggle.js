import React from 'react'
import styled from 'styled-components'
import breakpoints from '../../styles/breakpoints'
import colors from '../../styles/colors'

const ToggleCheckbox = styled.input`
  display: none;

  &:checked ~ nav {
    transform: scale(1, 1);
  }

  &:checked ~ nav li {
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

const HamburgerToggle = () => {
  return (
    <>
      <ToggleLabel htmlFor="toggle-checkbox">
        <span />
      </ToggleLabel>
      <ToggleCheckbox type="checkbox" id="toggle-checkbox" />
    </>
  )
}

export default HamburgerToggle
