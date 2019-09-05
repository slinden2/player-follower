import React from 'react'
import styled, { css } from 'styled-components'
import { statHeaders, teamStatHeaders } from '../utils'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

const Container = styled.div`
  width: 100%;
  margin-bottom: 10px;
`

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`

const TableTitle = styled.h3`
  margin: 0;
  text-align: center;
  margin-bottom: 5px;
  font-weight: bolder;
`

const TableHead = styled.thead``

const TableBody = styled.tbody``

const TableRow = styled.tr`
  ${props => props.showPointer && 'cursor: pointer;'}
`

const cellStyling = css`
  border: 2px solid ${colors.grey3};
  text-align: center;
  padding: 5px;
  font-size: 2vw;
  background-color: ${colors.grey4};
`

const TableCell = styled.td`
  ${cellStyling}
  ${props => props.highlight && `background-color: ${colors.grey2};`}
  ${props => props.leftAlign && `text-align: left; width: 150px;`}

  @media ${breakpoints.hideOnMobile} {
    ${props => !props.showOnMobile && 'display: none'};
  }

  @media ${breakpoints.showDesktopNavi} {
    font-size: 0.75rem;
  }
`

const HeaderCell = styled.th`
  ${cellStyling}
  background-color: ${colors.grey2};
  ${props => props.showPointer && 'cursor: pointer;'}

  @media ${breakpoints.hideOnMobile} {
    ${props => !props.showOnMobile && 'display: none'};
  }

  @media ${breakpoints.showDesktopNavi} {
    font-size: 0.875rem;
  }
`

const StatsTable = ({
  headers,
  title,
  data,
  sortVariables,
  setSortVariables,
  handleRowClick,
  isTeamStats,
  sortOnClient,
}) => {
  const sortDisabled = !sortVariables
  const sortProp = sortOnClient ? 'id' : 'sortString'

  // cant sort by these fields atm because of
  // how aggregation is done in the backend
  const disableSortVariables = [
    'PLAYER',
    'TEAM',
    'POSITION',
    'fullName',
    'team',
    'position',
    'teamName',
  ]

  const handleNewVariables = sortBy => {
    if (disableSortVariables.includes(sortBy) || sortDisabled) return
    if (sortBy === sortVariables.sortBy) {
      sortVariables.sortDir === 'DESC'
        ? setSortVariables({ offset: 0, sortBy, sortDir: 'ASC' })
        : setSortVariables({ offset: 0, sortBy, sortDir: 'DESC' })
    } else {
      setSortVariables({ offset: 0, sortBy, sortDir: 'DESC' })
    }
  }

  const handleClick = item => {
    return handleRowClick ? handleRowClick(item) : false
  }

  // Team related stats use different dataset for headers
  const headersToUse = isTeamStats ? teamStatHeaders : statHeaders

  const createHeaders = () => (
    <TableRow>
      {headers.map(header => (
        <HeaderCell
          key={headersToUse[header].headerText}
          onClick={() => handleNewVariables(headersToUse[header][sortProp])}
          title={headersToUse[header].title}
          showOnMobile={headersToUse[header].showOnMobile}
          showPointer={
            sortVariables &&
            !disableSortVariables.includes(headersToUse[header][sortProp])
          }
        >
          {headersToUse[header].headerText}
        </HeaderCell>
      ))}
    </TableRow>
  )

  const createCells = () =>
    data.map(item => (
      <TableRow
        key={item.id}
        onClick={() => handleClick(item)}
        showPointer={handleRowClick}
      >
        {headers.map(header => {
          return (
            <TableCell
              key={headersToUse[header].id}
              showOnMobile={headersToUse[header].showOnMobile}
              highlight={
                sortVariables &&
                sortVariables.sortBy === headersToUse[header][sortProp]
              }
              leftAlign={headersToUse[header].leftAlign}
            >
              {item[headersToUse[header].id]}
            </TableCell>
          )
        })}
      </TableRow>
    ))

  return (
    <Container>
      <TableTitle>{title}</TableTitle>
      <Table>
        <TableHead>{createHeaders()}</TableHead>
        <TableBody>{createCells()}</TableBody>
      </Table>
    </Container>
  )
}

export default StatsTable
