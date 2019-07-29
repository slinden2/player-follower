import React from 'react'
import { Dropdown } from 'semantic-ui-react'

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
      standingsType => standingsType.text === e.target.textContent
    )
    setStandingsType(type.value)
  }

  return (
    <Dropdown
      placeholder="Select standings"
      fluid
      selection
      options={standingsTypes}
      onChange={handleStandingsType}
    />
  )
}

export default StandingsTypeDropdown
