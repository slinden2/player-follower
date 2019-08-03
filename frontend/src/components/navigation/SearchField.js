import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'
import icon from '../../assets/magnifying-glass-icon.svg'

const SearchContainer = styled.div`
  display: table-cell;
  vertical-align: middle;
  position: relative;
  border-right: 1px solid ${colors.grey3};
  padding: 0 10px;
`

const Input = styled.input`
  height: 50px;
  width: 300px;
  border-radius: 50px;
  background-color: ${colors.grey4};
  border: 3px solid ${colors.grey3};
  color: ${colors.white1};
  text-indent: 10px;
  padding-right: 50px;
  font-family: 'Quicksand', Arial;
  font-size: 1.5rem;
  vertical-align: middle;
  outline-width: 0px;
  margin-right: 5px;

  &:focus {
    border-color: ${colors.white1};
    box-shadow: 0 0 5px ${colors.white1};
  }
`

const SearchIcon = styled.object`
  position: absolute;
  width: 30px;
  height: 30px;
  top: 50%;
  left: 320px;
`

const RadioContainer = styled.div`
  display: inline-block;
`

const SearchField = () => {
  return (
    <SearchContainer>
      <Input />
      <SearchIcon type="image/svg+xml" data={icon}>
        <img src={icon} alt="search icon" />
      </SearchIcon>
      <RadioContainer>
        <label>Players</label>
        <input type="radio" name="type" value="players" checked />

        <label>Teams</label>
        <input type="radio" name="type" value="teams" />
      </RadioContainer>
    </SearchContainer>
  )
}

export default SearchField
