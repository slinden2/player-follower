import React from 'react'
import styled from 'styled-components'
import { statHeaders, teamStatHeaders } from '../../utils'
import HeaderCell from './HeaderCell'
import TableCell from './TableCell'

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

  const highlightColumn = header =>
    sortVariables && sortVariables.sortBy === headersToUse[header][sortProp]

  const showOnMobile = header => headersToUse[header].showOnMobile

  const leftAlign = header => headersToUse[header].leftAlign

  const getData = (item, header) => {
    return item[headersToUse[header].id]
  }

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
          showOnMobile={showOnMobile(header)}
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
              key={header}
              data={getData(item, header)}
              highlight={highlightColumn(header)}
              showOnMobile={showOnMobile(header)}
              leftAlign={leftAlign(header)}
            />
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
