import React from 'react'
import styled from 'styled-components'

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

const RadioContainer = () => {
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
    </Container>
  )
}

export default RadioContainer
