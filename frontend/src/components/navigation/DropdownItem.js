import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import colors from '../../styles/colors'

const Container = styled.li`
  line-height: 2rem;
  border-bottom: 1px solid ${colors.grey3};
`

const DropdownItem = ({ name, link }) => {
  return (
    <Container>
      <Link to={link}>{name}</Link>
    </Container>
  )
}

export default DropdownItem
