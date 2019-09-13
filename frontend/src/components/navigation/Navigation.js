import React from 'react'
import styled from 'styled-components'
import NavContainer from './NavContainer'
import HamburgerToggle from './HamburgerToggle'
import Img from '../../assets/logo.png'
import colors from '../../styles/colors'
import variables from '../../styles/variables'
import breakpoints from '../../styles/breakpoints'

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
    align-items: stretch;
    border-bottom: 2px solid ${colors.grey2};
    border-top: 2px solid ${colors.grey2};
  }
`

const Logo = styled.img``

const LogoContainer = styled.div`
  flex: none;
  font-size: 1.5rem;
  padding-left: 1em;
  text-transform: uppercase;

  @media ${breakpoints.showDesktopNavi} {
    padding: 0 1em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
  }
`

const Navigation = () => {
  return (
    <Container>
      <LogoContainer>
        <Logo src={Img} />
      </LogoContainer>
      <HamburgerToggle />
      <NavContainer />
    </Container>
  )
}

export default Navigation
