import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import colors from '../../../styles/colors'
import Tooltip from './Tooltip'

const Container = styled.div`
  width: 100%;
  position: relative;
  opacity: 0.8;
  transition: opacity 200ms ease-in-out;

  &:hover {
    opacity: 0.95;
  }
`

const Puck = styled.circle`
  &:hover {
    filter: url(#drop-shadow);
  }
`

const RinkSvg = styled.svg`
  max-width: 1000px;
  display: block;
  position: relative;
`

const Rink = () => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const refContainer = useRef(null)

  const data = [
    {
      teams: {
        away: 'ANA',
        home: 'BUF',
      },
      coordinates: {
        x: 70,
        y: -40,
      },
    },
    {
      teams: {
        away: 'ANA',
        home: 'BUF',
      },
      coordinates: {
        x: 60,
        y: 20,
      },
    },
    {
      teams: {
        away: 'ANA',
        home: 'BUF',
      },
      coordinates: {
        x: -84,
        y: -10,
      },
    },
  ]

  const handleMouseOver = e => {
    setTooltipPos({
      x: e.pageX - refContainer.current.offsetLeft,
      y: e.pageY - refContainer.current.offsetTop,
    })
    setShowTooltip(true)
  }

  return (
    <Container ref={refContainer}>
      <RinkSvg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        viewBox="0 0 201 86"
      >
        <defs>
          <filter
            id="drop-shadow"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
            filterUnits="userSpaceOnUse"
          >
            <feFlood
              floodColor={colors.blue1}
              floodOpacity="0.7"
              in="SourceGraphic"
            />
            <feComposite operator="in" in2="SourceGraphic" />
            <feGaussianBlur stdDeviation="1" />
            <feComponentTransfer result="glow1">
              <feFuncA type="linear" slope="4" intercept="0" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M200.498 71.5V14.503c0-8-6-13.999-14-13.999H14.502c-8 0-14 6-14 14V71.5c0 8 6 14 14 14h171.996c8 0 14-6 14-14z"
          fill="#fff"
          stroke={colors.grey1}
          strokeWidth="1"
        />
        <path
          d="M100.398 28.526c8.012 0 14.516 6.503 14.516 14.516 0 8.012-6.503 14.516-14.516 14.516s-14.516-6.503-14.516-14.516 6.503-14.516 14.516-14.516z"
          fill="none"
          stroke="#0039a6"
          strokeWidth=".5"
        />
        <path
          d="M100.495 85.5L100.5.504"
          fill="none"
          stroke="#c60c30"
          strokeWidth="1.7"
        />
        <g fill="none" stroke="#0039a6" strokeWidth="5">
          <path d="M125.5 85.5V.504M75.502 85.5V.504" strokeWidth="1.6732" />
        </g>
        <g fill="#eceeee" fillRule="evenodd" stroke="#c60c30" strokeWidth="1.5">
          <path
            d="M11.525 46.159c-1.014.448-2.381.448-3.296 0v-6.28c.666-.448 2.345-.448 3.296 0zM189.475 46.159c1.015.448 2.382.448 3.297 0v-6.28c-.666-.448-2.346-.448-3.297 0z"
            strokeWidth=".5"
          />
        </g>
        <g fill="#3db7e4" fillRule="evenodd" stroke="#c60c30" strokeWidth="1.5">
          <path
            d="M189.499 47.002h-4.516s-1.484-1.505-1.484-3.99c0-2.525 1.484-4.01 1.484-4.01h4.516v8M11.502 47.002h4.516s1.484-1.505 1.484-3.99c0-2.525-1.484-4.01-1.484-4.01h-4.516v8"
            strokeWidth=".5"
          />
        </g>
        <path
          d="M32.992 50.502v-3M29.987 50.502v-3M11.502 85.5V.504M189.498 85.5V.504M167.5 68.906v-3h-4M167.5 61.096v3h-4M171.498 68.906v-3h4M171.498 61.096v3h4M167.5 24.909v-3h-4M167.5 17.095v3h-4M171.498 24.909v-3h4M171.498 17.095v3h4M29.502 24.909v-3h-4M29.502 17.095v3h-4M33.5 24.909v-3h4M33.5 17.095v3h4M29.502 68.906v-3h-4M29.502 61.096v3h-4M33.5 68.906v-3h4M33.5 61.096v3h4M167.994 82.501v-3M171 82.501v-3M167.994 50.502v-3M171 50.502v-3M29.987 82.501v-3M32.992 82.501v-3M29.987 38.502v-3M32.992 38.502v-3M29.987 6.504v-3M32.992 6.504v-3M167.994 38.502v-3M171 38.502v-3M167.994 6.504v-3M171 6.504v-3"
          fill="none"
          stroke="#c60c30"
          strokeWidth=".5"
        />
        <path
          d="M169.497 50.565c8.012 0 14.516 6.503 14.516 14.516 0 8.012-6.503 14.516-14.516 14.516S154.98 73.094 154.98 65.08s6.503-14.516 14.516-14.516zM170.133 6.53c8.012 0 14.515 6.503 14.515 14.516s-6.502 14.516-14.515 14.516c-8.013 0-14.516-6.503-14.516-14.516 0-8.012 6.503-14.516 14.516-14.516zM31.35 6.681c8.012 0 14.515 6.503 14.515 14.516 0 8.012-6.503 14.516-14.516 14.516-8.012 0-14.516-6.503-14.516-14.516S23.336 6.68 31.35 6.68zM31.6 50.465c8.013 0 14.516 6.503 14.516 14.516 0 8.012-6.503 14.515-14.516 14.515-8.012 0-14.516-6.503-14.516-14.515 0-8.013 6.503-14.516 14.516-14.516zM90.389 85.544c0-5.52 4.48-10 10-10s10 4.48 10 10h-10z"
          fill="none"
          stroke="#c60c30"
          strokeWidth=".5"
        />
        <path
          d="M169.503 66.031c.301 0 .572-.132.758-.34v-1.346a1.011 1.011 0 00-1.516 0v1.345c.185.21.456.341.758.341z"
          fill="#c60c30"
        />
        <path
          d="M168.53 65.016a.971.971 0 111.943 0 .971.971 0 01-1.942 0z"
          fill="none"
          stroke="#c60c30"
          strokeWidth=".2"
        />
        <path
          d="M169.457 21.986c.301 0 .572-.132.758-.341V20.3a1.011 1.011 0 00-1.517 0v1.345c.186.209.457.34.759.34z"
          fill="#c60c30"
        />
        <path
          d="M168.485 20.97a.971.971 0 111.942 0 .971.971 0 01-1.942 0z"
          fill="none"
          stroke="#c60c30"
          strokeWidth=".2"
        />
        <path
          d="M120.483 22.027c.302 0 .573-.132.759-.341V20.34a1.011 1.011 0 00-1.517 0v1.345c.186.209.457.34.758.34z"
          fill="#c60c30"
        />
        <path
          d="M119.512 21.012a.971.971 0 111.942 0 .971.971 0 01-1.942 0z"
          fill="none"
          stroke="#c60c30"
          strokeWidth=".2"
        />
        <path
          d="M120.483 66.009c.302 0 .573-.132.759-.341v-1.345a1.011 1.011 0 00-1.517 0v1.344c.186.21.457.342.758.342z"
          fill="#c60c30"
        />
        <path
          d="M119.512 64.993a.971.971 0 111.942 0 .971.971 0 01-1.942 0z"
          fill="none"
          stroke="#c60c30"
          strokeWidth=".2"
        />
        <path
          d="M80.47 65.968c.302 0 .573-.132.758-.341v-1.345a1.011 1.011 0 00-1.516 0v1.344c.186.21.457.342.758.342z"
          fill="#c60c30"
        />
        <path
          d="M79.498 64.953a.971.971 0 111.943 0 .971.971 0 01-1.943 0z"
          fill="none"
          stroke="#c60c30"
          strokeWidth=".2"
        />
        <path
          d="M80.511 22.027c.302 0 .573-.132.758-.341V20.34a1.011 1.011 0 00-1.516 0v1.345c.186.209.457.34.758.34z"
          fill="#c60c30"
        />
        <path
          d="M79.54 21.012a.971.971 0 111.942 0 .971.971 0 01-1.943 0z"
          fill="none"
          stroke="#c60c30"
          strokeWidth=".2"
        />
        <path
          d="M31.538 21.986c.302 0 .573-.132.758-.341V20.3a1.011 1.011 0 00-1.516 0v1.345c.186.209.456.34.758.34z"
          fill="#c60c30"
        />
        <path
          d="M30.566 20.97a.971.971 0 111.943 0 .971.971 0 01-1.943 0z"
          fill="none"
          stroke="#c60c30"
          strokeWidth=".2"
        />
        <g>
          <path
            d="M31.456 66.009c.302 0 .573-.132.758-.341v-1.345a1.011 1.011 0 00-1.516 0v1.344c.186.21.457.342.758.342z"
            fill="#c60c30"
          />
          <path
            d="M30.484 64.993a.971.971 0 111.943 0 .971.971 0 11-1.943 0z"
            fill="none"
            stroke="#c60c30"
            strokeWidth=".2"
          />
        </g>
        <path
          d="M100.495 42.5a.502.502 0 110 1.005.502.502 0 010-1.005z"
          fill="#0039a6"
        />
        <path
          d="M189.498 32.21v21.584l10.973 3.012V29.2zM11.502 32.21v21.584L.53 56.806V29.2z"
          fill="none"
          stroke="#c60c30"
          strokeWidth=".5"
          strokeLinecap="square"
        />
        <g
          fill="none"
          stroke="#c60c30"
          strokeWidth="1.509"
          strokeLinecap="square"
        >
          <path
            d="M14.788 47.001v-.498M14.788 39.502v-.498"
            strokeWidth=".50497176"
          />
        </g>
        <g
          fill="none"
          stroke="#c60c30"
          strokeWidth="1.509"
          strokeLinecap="square"
        >
          <path
            d="M186.045 47.001v-.498M186.045 39.502v-.498"
            strokeWidth=".50497176"
          />
        </g>
        <path
          d="M200.498 71.5V14.503c0-8-6-13.999-14-13.999H14.502c-8 0-14 6-14 14V71.5c0 8 6 14 14 14h171.996c8 0 14-6 14-14z"
          fill="none"
          stroke={colors.grey1}
          strokeWidth="1"
        />
        {data &&
          data.map((goal, i) => (
            <Puck
              key={i}
              cx={100.5 + goal.coordinates.x}
              cy={43 + goal.coordinates.y}
              r="1"
              onMouseOver={handleMouseOver}
              onMouseLeave={() => setShowTooltip(false)}
            />
          ))}
      </RinkSvg>
      <Tooltip show={showTooltip} position={tooltipPos} />
    </Container>
  )
}

export default Rink
