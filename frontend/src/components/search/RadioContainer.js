import React from 'react'
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
  const handleRadioChange = ({ target: { value } }) => {
    resetAll()
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
          onChange={handleRadioChange}
        />
      </RadioRow>
    </Container>
  )
}

export default RadioContainer
