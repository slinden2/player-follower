import React from 'react'
import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

const linkStyling = css`
  background-image: linear-gradient(
    rgba(0, 0, 0, 0) 70%,
    rgba(108, 129, 203, 1) 0px
  );

  &:hover {
    font-weight: bolder;
  }
`

const SLink = styled(Link)`
  ${linkStyling}
`

const Span = styled.span`
  ${linkStyling}
  cursor: pointer;
`

const StyledLink = ({ to, name, onClick, style }) => {
  return to ? (
    <SLink to={to} name={name} style={style}>
      {name}
    </SLink>
  ) : (
    <Span onClick={onClick} style={style}>
      {name}
    </Span>
  )
}

export default StyledLink
