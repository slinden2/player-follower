import React, { useEffect, useCallback } from 'react'
import styled from 'styled-components'
import Link from './elements/StyledLink'
import Button from './elements/Button'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'
import { setCookie, getCookie } from '../utils/index'

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: ${colors.grey1};
  padding: 10px 20px 10px 20px;
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

const ConsentButton = styled(Button)`
  margin-left: auto;
`

const CookiePolicy = ({ setCookieConsent }) => {
  const setCookies = useCallback(() => {
    let rootNode = document.documentElement,
      body = document.body,
      top = 'scrollTop',
      height = 'scrollHeight'

    let percentage =
      ((rootNode[top] || body[top]) /
        ((rootNode[height] || body[height]) - rootNode.clientHeight)) *
      100

    if (percentage > 5) {
      setCookie('funcConsent', true, 365)
      setCookie('gaConsent', true, 365)
      setCookieConsent(true)
    }
  }, [setCookieConsent])

  useEffect(() => {
    window.addEventListener('scroll', setCookies)
  }, [setCookies])

  if (getCookie('funcConsent')) {
    window.removeEventListener('scroll', setCookies)
    return null
  }

  return (
    <Container>
      <Text>
        This website uses cookies to ensure you get the best experience on our
        website. You accept the cookie policy by clicking <i>Accept</i>, by
        scrolling the page or by continuing to browse otherwise.{' '}
      </Text>
      <LinkContainer>
        <Link to="/privacy-policy" name="Learn more" />
      </LinkContainer>
      <ConsentButton content="Accept" size="medium" onClick={setCookies} />
    </Container>
  )
}

export default CookiePolicy
