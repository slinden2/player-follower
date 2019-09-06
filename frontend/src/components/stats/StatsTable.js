import React from 'react'
import styled from 'styled-components'
import { statHeaders, teamStatHeaders } from '../../utils'
import CellStyling from './CellStyling'
import HeaderCell from './HeaderCell'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'

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

const TableCell = styled.td`
  ${CellStyling}
  ${props => props.highlight && `background-color: ${colors.grey2};`}
  ${props => props.leftAlign && `text-align: left; width: 150px;`}

  @media ${breakpoints.hideOnMobile} {
    ${props => !props.showOnMobile && 'display: none'};
  }

  @media ${breakpoints.showDesktopNavi} {
    font-size: 0.75rem;
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
  const sortProp = sortOnClient ? 'id' : 'sortString'

  const handleClick = item => {
    return handleRowClick ? handleRowClick(item) : false
  }

  // Team related stats use different dataset for headers
  const headersToUse = isTeamStats ? teamStatHeaders : statHeaders

  const createHeaders = () => (
    <TableRow>
      {headers.map(header => (
        <HeaderCell
          key={header}
          header={header}
          columnData={headersToUse}
          sortOnClient={sortOnClient}
          sortVariables={sortVariables}
          setSortVariables={setSortVariables}
        />
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
