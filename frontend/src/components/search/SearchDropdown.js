import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'
import SearchDropdownRow from './SearchDropdownRow'

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

const SearchDropdown = ({ results, resetAll }) => {
  let isTeamData = false
  if (results[0].__typename === 'Team') isTeamData = true

  return (
    <Container>
      <Table>
        <SearchDropdownRow header isTeamData={isTeamData} />
        {results.map((item, i) => (
          <SearchDropdownRow
            key={i}
            data={item}
            resetAll={resetAll}
            isTeamData={isTeamData}
          />
        ))}
      </Table>
    </Container>
  )
}

export default SearchDropdown
