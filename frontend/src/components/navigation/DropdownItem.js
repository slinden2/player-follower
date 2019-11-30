import React from 'react'
import styled from 'styled-components'

const Container = styled.li``

const DropdownItem = ({ data }) => {
  return <Container>{data.name}</Container>
}

export default DropdownItem
