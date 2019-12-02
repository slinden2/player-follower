import React, { useContext } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import colors from '../../styles/colors'
import { HamburgerContext } from '../../contexts/HamburgerContext'

const Container = styled.li`
  line-height: 2rem;
  border-bottom: 1px solid ${colors.grey3};
`

const DropdownItem = ({ name, link, closeDropdown }) => {
  const { closeNavi } = useContext(HamburgerContext)

  const handleDropdownClick = event => {
    // Pass event to closeDropdown to stop propagation
    // to the li parent component. The propagation would cause
    // the dropdown to reopen.
    closeDropdown(event)
    closeNavi()
  }

  return (
    <Container>
      <Link to={link} onClick={handleDropdownClick}>
        {name}
      </Link>
    </Container>
  )
}

export default DropdownItem
