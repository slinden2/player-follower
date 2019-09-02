import React, { useState } from 'react'
import styled from 'styled-components'
import { FIND_BY_NAME } from '../../graphql/queries'
import { GET_TEAMS_BY_NAME } from '../../graphql/queries'

const Container = styled.div`
  display: table;
`

const RadioRow = styled.div`
  display: table-row;

  & .filter-cell {
    display: table-cell;
    vertical-align: middle;
  }
`

const RadioContainer = ({ setQuery, resetAll }) => {
  const [selectedOption, setSelectedOption] = useState('players')

  const handleRadioChange = ({ target: { value } }) => {
    resetAll()
    setSelectedOption(value)
    if (value === 'players') setQuery(FIND_BY_NAME)
    else if (value === 'teams') setQuery(GET_TEAMS_BY_NAME)
    else setQuery(FIND_BY_NAME)
  }

  return (
    <Container>
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
          checked={selectedOption === 'players'}
          onChange={handleRadioChange}
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
          checked={selectedOption === 'teams'}
          onChange={handleRadioChange}
        />
      </RadioRow>
    </Container>
  )
}

export default RadioContainer
