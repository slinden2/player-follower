import React from 'react'
import styled from 'styled-components'
import DropdownMenu from '../../elements/DropdownMenu'

const Container = styled.div`
  border: 1px solid red;
  text-align: center;
`

const filterTypes = [
  {
    key: 'ALL',
    text: 'All players',
    value: 'ALL',
  },
  {
    key: 'FORWARD',
    text: 'Forwards',
    value: 'FORWARD',
  },
  {
    key: 'DEFENCE',
    text: 'Defencemen',
    value: 'DEFENCE',
  },
]

const PlayerCardFilter = () => {
  return (
    <Container>
      <DropdownMenu items={filterTypes} />
    </Container>
  )
}

export default PlayerCardFilter
