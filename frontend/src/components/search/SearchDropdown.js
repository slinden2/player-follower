import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'
import DropdownRow from './SearchDropdownRow'

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

const Table = styled.div`
  display: table;
  width: 100%;
`

const SearchDropdown = ({ results }) => {
  return (
    <Container>
      <Table>
        <DropdownRow header />
        {results.map(player => (
          <DropdownRow key={player.playerId} player={player} />
        ))}
      </Table>
    </Container>
  )
}

export default SearchDropdown
