import React from 'react'
import { Link } from 'react-router-dom'
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

const LinkItem = styled(Link)``

const playerItems = object => [
  {
    data: _.get(object, 'fullName'),
    link: _.get(object, 'siteLink'),
    header: 'Player',
    first: true,
  },
  { data: _.get(object, 'currentTeam.abbreviation'), header: 'Team' },
  { data: _.get(object, 'nationality'), header: 'Co.' },
]

const teamItems = object => [
  {
    data: _.get(object, 'name'),
    link: _.get(object, 'siteLink'),
    header: 'Team',
    first: true,
  },
]

const hasLink = object => _.has(object, 'link')

const SearchDropdownRow = ({ data, header, resetAll, isTeamData }) => {
  const dataArray = isTeamData ? teamItems : playerItems

  return (
    <Container header={header}>
      {dataArray(data).map((item, i) => (
        <DataItem key={i} first={item.first} header={header}>
          {header ? (
            item.header
          ) : hasLink(item) ? (
            <LinkItem onClick={resetAll} to={`/players/${item.link}`}>
              {item.data}
            </LinkItem>
          ) : (
            item.data
          )}
        </DataItem>
      ))}
    </Container>
  )
}

export default SearchDropdownRow
