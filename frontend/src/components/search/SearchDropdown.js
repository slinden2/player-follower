import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'
import DropdownRow from './SearchDropdownRow'

const Container = styled.div`
  display: ${props => (props.hide ? 'none' : 'block')};
  position: absolute;
  top: 50%;
  width: 295px;
  border: 3px solid ${colors.grey3};
  border-radius: 10px;
  background-color: ${colors.grey2};
  z-index: 9;
  padding: 30px 10px 10px 10px;
  max-height: 90vh;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`

const Table = styled.div`
  display: table;
  width: 100%;
`

const DropdownLoader = styled.div``

const SearchDropdown = ({ results, isLoading, resetAll }) => {
  const showResults = results.length > 0 && !isLoading
  const hide = !showResults && !isLoading

  return (
    <Container hide={hide}>
      {isLoading && <DropdownLoader>Loading...</DropdownLoader>}
      {showResults && (
        <Table>
          <DropdownRow header />
          {results.map(player => (
            <DropdownRow
              key={player.playerId}
              player={player}
              resetAll={resetAll}
            />
          ))}
        </Table>
      )}
    </Container>
  )
}

export default SearchDropdown
