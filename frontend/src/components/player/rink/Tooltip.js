import React from 'react'
import styled, { css } from 'styled-components'
import colors from '../../../styles/colors'

const TooltipSvg = styled.svg`
  position: absolute;
  left: ${({ position }) => `${position.x - 39.36}px`};
  top: ${({ position }) => `${position.y - 50.5}px`};
  z-index: 5;
  opacity: 1;
  transition: opacity 100ms ease-in-out;
  ${({ show }) =>
    !show &&
    css`
      opacity: 0;
    `}
`

const Tooltip = ({ show, position }) => {
  return (
    <TooltipSvg
      xmlns="http://www.w3.org/2000/svg"
      width="78.75"
      height="40.5"
      viewBox="0 0 105 54"
      show={show}
      position={position}
    >
      <path
        d="M52.4737 52.7895L66.512 36.311h35.9536c.821 0 1.4818-.4157 1.4818-.932V1.9318c0-.5162-.661-.9318-1.4818-.9318H2.4818C1.661 1 1 1.4156 1 1.9318v33.4474c0 .5162.661.932 1.4818.932h35.9536z"
        strokeWidth="3"
        stroke={colors.grey1}
        fill={colors.grey4}
      />
      <text
        textAnchor="middle"
        fill={colors.white1}
        fontFamily="Quicksand"
        fontSize="16"
        stroke="none"
      >
        <tspan x="52.4737" y="21.3242">
          WSH@WSH
        </tspan>
      </text>
    </TooltipSvg>
  )
}

export default Tooltip
