import React from 'react'
import styled from 'styled-components'

const Dropdown = styled.select``

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
