import React from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import styled from 'styled-components'
import colors from '../../styles/colors'
import icon from '../../assets/magnifying-glass-icon.svg'
import { useSearch } from '../../hooks'
import SearchDropdown from './SearchDropdown'
import _ from 'lodash'

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

const RadioContainer = styled.div`
  display: table;
`

const RadioRow = styled.div`
  display: table-row;

  & .filter-cell {
    display: table-cell;
    vertical-align: middle;
  }
`

const SearchField = () => {
  const [search, results, isLoading] = useSearch()

  console.log(results)

  const showResults = () => !isLoading && results.length > 0

  return (
    <SearchContainer>
      <Input {...search} />
      <SearchIcon type="image/svg+xml" data={icon}>
        Test
      </SearchIcon>
      <RadioContainer>
        <RadioRow>
          <label className="filter-cell" htmlFor="player-radio">
            Players
          </label>
          <input
            className="filter-cell"
            id="player-radio"
            type="radio"
            name="type"
            value="players"
          />
        </RadioRow>
        <RadioRow>
          <label className="filter-cell" htmlFor="team-radio">
            Teams
          </label>
          <input
            className="filter-cell"
            id="team-radio"
            type="radio"
            name="type"
            value="teams"
          />
        </RadioRow>
      </RadioContainer>
      {showResults() && <SearchDropdown />}
    </SearchContainer>
  )
}

export default SearchField
