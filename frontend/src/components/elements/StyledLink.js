import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const SLink = styled(Link)`
  background-image: linear-gradient(
    rgba(0, 0, 0, 0) 70%,
    rgba(108, 129, 203, 1) 0px
  );

  &:hover {
    font-weight: bolder;
  }
`

const StyledLink = ({ to, name }) => {
  return (
    <SLink to={to} name={name}>
      {name}
    </SLink>
  )
}

export default StyledLink
