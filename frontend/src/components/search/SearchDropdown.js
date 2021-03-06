import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'
import SearchDropdownRow from './SearchDropdownRow'

const Container = styled.div`
  display: ${props => (props.hide ? 'none' : 'block')};
  position: absolute;
  top: 50%;
  width: ${props => (props.noNav ? '100%' : '276px')};
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

const SearchDropdown = ({ results, resetAll, noNav }) => {
  let isTeamData = false
  if (results[0].__typename === 'Team') isTeamData = true

  return (
    <Container noNav={noNav} data-cy='search-result-container'>
      <Table>
        <SearchDropdownRow
          header
          isTeamData={isTeamData}
          dataCy='search-header'
        />
        {results.map((item, i) => (
          <SearchDropdownRow
            key={i}
            data={item}
            resetAll={resetAll}
            isTeamData={isTeamData}
            dataCy='search-result'
          />
        ))}
      </Table>
    </Container>
  )
}

export default SearchDropdown
