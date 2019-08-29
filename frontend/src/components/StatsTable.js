import React from 'react'
import styled, { css } from 'styled-components'
import colors from '../styles/colors'

const Container = styled.div`
  width: 100%;
  margin-bottom: 10px;
`

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`

const TableTitle = styled.div`
  text-align: center;
  margin-bottom: 5px;
  font-weight: bolder;
`

const TableHead = styled.thead``

const TableBody = styled.tbody``

const TableRow = styled.tr`
  cursor: pointer;
`

const cellStyling = css`
  border: 2px solid ${colors.grey3};
  text-align: center;
  padding: 5px;
  font-size: 0.75rem;
`

const TableCell = styled.td`
  ${cellStyling}
`

const HeaderCell = styled.th`
  ${cellStyling}
  background-color: ${colors.grey2};
  font-size: 0.875rem;
`

const StatsTable = ({
  headers,
  title,
  data,
  sortVariables,
  setSortVariables,
  handleRowClick,
}) => {
  const handleNewVariables = sortBy => {
    // cant sort by these fields atm because of
    // how aggregation is done in the backend
    if (
      sortBy === 'PLAYER' ||
      sortBy === 'TEAM' ||
      sortBy === 'POSITION' ||
      !sortBy
    )
      return

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

  const createHeaders = () => (
    <tr>
      {headers.map(header => (
        <HeaderCell
          key={header.headerText}
          onClick={() => handleNewVariables(header.sortString)}
        >
          {header.headerText}
        </HeaderCell>
      ))}
    </tr>
  )

  const createCells = () =>
    data.map(item => (
      <TableRow key={item.id} onClick={() => handleClick(item)}>
        {headers.map(stat => {
          return <TableCell key={stat.id}>{item[stat.id]}</TableCell>
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
