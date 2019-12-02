import React, { useContext } from 'react'
import styled, { css } from 'styled-components'
import { HamburgerContext } from '../../contexts/HamburgerContext'
import breakpoints from '../../styles/breakpoints'
import colors from '../../styles/colors'

const ToggleCheckbox = styled.input`
  display: none;

  &:checked ~ div {
    transform: scale(1, 1);
  }

  &:checked ~ div nav li {
    opacity: 1;
    transition: opacity 250ms ease-in-out 250ms;
  }
`

const ToggleLabel = styled.label`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  margin-left: 1em;
  width: 40px;
  height: 100%;

  @media ${breakpoints.showDesktopNavi} {
    display: none;
  }
`

const lineStyles = css`
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 4px;
  background: ${colors.white1};
  transition: all 0.2s ease-in-out;
`

const Line1 = styled.span`
  ${lineStyles}
  top: 20px;

  ${({ checked }) =>
    checked &&
    css`
      transform: translateY(10px) rotate(45deg);
    `}
`
const Line2 = styled.span`
  ${lineStyles}
  top: 30px;

  ${({ checked }) =>
    checked &&
    css`
      opacity: 0;
      transform: translateX(-100%);
    `}
`
const Line3 = styled.span`
  ${lineStyles}
  top: 40px;

  ${({ checked }) =>
    checked &&
    css`
      transform: translateY(-10px) rotate(-45deg);
    `}
`

const HamburgerToggle = () => {
  const { checked, handleToggle } = useContext(HamburgerContext)
  return (
    <>
      <ToggleLabel htmlFor='toggle-checkbox'>
        <Line1 checked={checked} />
        <Line2 checked={checked} />
        <Line3 checked={checked} />
      </ToggleLabel>
      <ToggleCheckbox
        type='checkbox'
        name='toggle-checkbox'
        id='toggle-checkbox'
        onChange={handleToggle}
        checked={checked}
      />
    </>
  )
}

export default HamburgerToggle
