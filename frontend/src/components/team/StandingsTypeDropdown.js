import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const Dropdown = styled.select`
  display: block;
  font-size: 0.75rem;
  color: ${colors.white1};
  background-color: ${colors.blue1};
  padding: 5px;
  margin: 5px 0;
  border: 0;
  border-radius: 10px;
  text-shadow: 1px 1px ${colors.grey1};

  &:hover {
    font-weight: bolder;
  }
`

const DropdownItem = styled.option``

const standingsTypes = [
  {
    key: 'LEAGUE',
    text: 'League',
    value: 'LEAGUE',
  },
  {
    key: 'CONFERENCE',
    text: 'Conference',
    value: 'CONFERENCE',
  },
  {
    key: 'DIVISION',
    text: 'Division',
    value: 'DIVISION',
  },
]

const StandingsTypeDropdown = ({ setStandingsType }) => {
  const handleStandingsType = e => {
    const type = standingsTypes.find(
      standingsType => standingsType.value === e.target.value
    )
    setStandingsType(type.value)
  }

  return (
    <Dropdown
      defaultValue={standingsTypes[0].value}
      onChange={handleStandingsType}
    >
      {standingsTypes.map(type => (
        <DropdownItem key={type.key} value={type.value}>
          {type.text}
        </DropdownItem>
      ))}
    </Dropdown>
  )
}

export default StandingsTypeDropdown
