import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Container = styled.li``

const DropdownItem = ({ name, link }) => {
  return (
    <Container>
      <Link to={link}>{name}</Link>
    </Container>
  )
}

export default DropdownItem
