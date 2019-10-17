import React from 'react'
import styled, { css } from 'styled-components'
import colors from '../../../styles/colors'

const TooltipSvg = styled.svg`
  position: absolute;
  left: ${({ position }) => `${position.x - 48}px`};
  top: ${({ position }) => `${position.y - 80}px`};
  z-index: 5;
  width: 90px;
  height: 60px;

  ${({ show }) =>
    !show &&
    css`
      opacity: 0;
      transform: translateX(-100vw);
      transition: opacity 100ms ease-in-out, transform 50ms ease-in-out 100ms;
    `}

  ${({ show }) =>
    show &&
    css`
      opacity: 1;
      transform: translateX(0);
      transition: opacity 100ms ease-in-out;
    `}
`

const Tooltip = ({ show, position, data }) => {
  return (
    <TooltipSvg position={position} show={show} viewBox="0 0 28 21">
      <rect
        width="100%"
        height="100%"
        x="0"
        y="0"
        fill={colors.grey4}
        stroke={colors.grey1}
        strokeWidth="0.75"
        strokeLinecap="round"
        ry="2.5"
        rx="2.5"
      />
      <text
        textAnchor="middle"
        fontSize="4"
        fontFamily="Quicksand"
        fill={colors.white1}
      >
        <tspan x="14" y="6">
          {`${data.awayTeam} @ ${data.homeTeam}`}
        </tspan>
      </text>
      <text
        textAnchor="middle"
        fontSize="3.5"
        fontFamily="Quicksand"
        fill={colors.white1}
        letterSpacing="0.45"
      >
        <tspan x="14" y="11">
          {data.gameDate}
        </tspan>
      </text>
      <text
        textAnchor="middle"
        fontSize="3.5"
        fontFamily="Quicksand"
        fill={colors.white1}
        letterSpacing="0.45"
      >
        <tspan x="14" y="15">
          {`${data.periodNumber} ${data.periodTime}`}
        </tspan>
      </text>
      <text
        textAnchor="middle"
        fontSize="3.5"
        fontFamily="Quicksand"
        fill={colors.white1}
        letterSpacing="0.45"
      >
        <tspan x="14" y="19">
          {data.strength}
        </tspan>
      </text>
    </TooltipSvg>
  )
}

export default Tooltip
