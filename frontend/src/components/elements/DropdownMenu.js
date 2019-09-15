import React from 'react'
import { Dropdown, DropdownItem } from '../../styles/forms'

const DropdownMenu = ({ items, setState }) => {
  const handleStandingsType = e => {
    const type = items.find(
      standingsType => standingsType.value === e.target.value
    )
    setState(type.value)
  }

  return (
    <Dropdown defaultValue={items[0].value} onChange={handleStandingsType}>
      {items.map(type => (
        <DropdownItem key={type.key} value={type.value}>
          {type.text}
        </DropdownItem>
      ))}
    </Dropdown>
  )
}

export default DropdownMenu
