import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const Container = styled.div`
  display: block;
  position: absolute;
  top: 50%;
  width: 295px;
  border: 3px solid ${colors.grey3};
  border-radius: 10px;
  background-color: ${colors.grey2};
  z-index: 9;
  padding: 30px 10px 10px 10px;
`

const SearchDropdown = () => {
  return <Container>test</Container>
}

export default SearchDropdown
