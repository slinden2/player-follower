import React from 'react'
import styled, { css } from 'styled-components'
import _ from 'lodash'
import colors from '../../styles/colors'

const rowDivider = css`
  &::after {
    content: '';
    position: absolute;
    left: 0;
    display: block;
    width: 100%;
    height: 1px;
    background-color: ${colors.grey3};
  }
`

const Container = styled.div`
  display: table-row;
  position: relative;
  width: 100%;
  ${props => !props.header && rowDivider}
`

const headerStyle = css`
  font-weight: bolder;
  padding: 10px 0;
`

const rowStyle = css`
  padding: 5px 0;
`

const DataItem = styled.div`
  display: table-cell;
  ${props => !props.first && 'text-align: center;'}
  ${props => (props.header ? headerStyle : rowStyle)}
`

const items = object => [
  { data: _.get(object, 'fullName'), header: 'Player', first: true },
  { data: _.get(object, 'currentTeam.abbreviation'), header: 'Team' },
  { data: _.get(object, 'nationality'), header: 'Co.' },
]

const SearchDropdownRow = ({ player, header }) => {
  return (
    <Container header={header}>
      {items(player).map((item, i) => (
        <DataItem key={i} first={item.first} header={header}>
          {header ? item.header : item.data}
        </DataItem>
      ))}
    </Container>
  )
}

export default SearchDropdownRow
