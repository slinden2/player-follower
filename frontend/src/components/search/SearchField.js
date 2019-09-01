import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'
import icon from '../../assets/magnifying-glass-icon.svg'
import { useSearch } from '../../hooks'
import SearchDropdown from './SearchDropdown'
import RadioContainer from './RadioContainer'

const SearchContainer = styled.div`
  margin: -1px 0 0 -1px; /* makes the borders collapse */
  position: relative;
  padding: 0 1rem;
  height: 100%;
  flex: none;
  display: flex;
  align-items: center;
  border-left: 1px solid ${colors.grey2};
  border-right: 1px solid ${colors.grey2};
  /* border: 1px solid green; */
`

const Input = styled.input`
  height: 40px;
  width: 275px;
  z-index: 10;
  border-radius: 50px;
  background-color: ${colors.grey4};
  border: 3px solid ${colors.grey3};
  color: ${colors.white1};
  text-indent: 1rem;
  padding-right: 40px;
  font-family: 'Quicksand', Arial;
  font-size: 1.25rem;
  vertical-align: middle;
  outline-width: 0px;
  margin-right: 0.5rem;

  &:focus {
    border-color: ${colors.white1};
    box-shadow: 0 0 5px ${colors.white1};
  }
`

const SearchIcon = styled.object`
  position: absolute;
  width: 24px;
  top: 30%;
  left: 66%;
  z-index: 11;
`

const SearchField = () => {
  const [search, results, isLoading, resetAll] = useSearch()

  return (
    <SearchContainer>
      <Input {...search} />
      <SearchIcon type="image/svg+xml" data={icon}>
        Test
      </SearchIcon>
      <RadioContainer />
      <SearchDropdown
        results={results}
        isLoading={isLoading}
        resetAll={resetAll}
      />
    </SearchContainer>
  )
}

export default SearchField
