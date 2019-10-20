import React from 'react'
import styled, { css } from 'styled-components'
import { Twitter, FacebookSquare } from 'styled-icons/fa-brands/'
import breakpoints from '../styles/breakpoints'
import variables from '../styles/variables'

const SocialContainer = styled.div`
  ${({ position }) =>
    position === 'navi' &&
    css`
      position: absolute;
      right: 0;
      display: flex;

      @media ${breakpoints.narrowScreen} {
        display: none;
      }

      @media ${breakpoints.showDesktopNavi} {
        position: static;
        margin-top: ${variables.navHeight / 2 - 16}px;
      }
    `}
`

const iconStyles = css`
  margin: 0 5px;
  transition: color 100ms ease-out;
`

const FacebookLogo = styled(FacebookSquare)`
  ${iconStyles}

  &:hover,
  :focus {
    color: #4267b2;
  }
`

const TwitterLogo = styled(Twitter)`
  ${iconStyles}

  &:hover,
  :focus {
    color: #1da1f2;
  }
`

const SocialIcons = ({ position }) => {
  const size = position === 'navi' ? '28' : '24'

  return (
    <SocialContainer position={position}>
      <a href="https://fb.me/playerfan/">
        <FacebookLogo size={size} />
      </a>
      <a href="https://twitter.com/playerfansite/">
        <TwitterLogo size={size} />
      </a>
    </SocialContainer>
  )
}

export default SocialIcons
