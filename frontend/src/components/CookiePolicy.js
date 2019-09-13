import React from 'react'
import styled from 'styled-components'
import Link from './elements/StyledLink'
import Button from './elements/Button'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  /* width: calc(100vw - (100vw - 100%)); */
  width: 100%;
  background-color: ${colors.grey1};
  padding: 10px;
  border-top: 3px solid ${colors.grey2};
  display: flex;
  flex-flow: row wrap;
`

const LinkContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Text = styled.p`
  margin-right: 10px;
  text-align: center;
  width: 100%;

  @media ${breakpoints.cookiePolicyWide} {
    width: auto;
    text-align: left;
  }
`

const CookiePolicy = () => {
  return (
    <Container>
      <Text>
        This website uses cookies to ensure you get the best experience on our
        website.{' '}
      </Text>
      <LinkContainer>
        <Link
          to="/privacy-policy"
          name="Learn more"
          onClick={() => console.log('click')}
        />
      </LinkContainer>
      <Button content="Got it!" size="medium" style={{ marginLeft: 'auto' }} />
    </Container>
  )
}

export default CookiePolicy
