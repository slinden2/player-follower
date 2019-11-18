import React, { useState, useLayoutEffect, useRef, useCallback } from 'react'
import styled, { css } from 'styled-components'
import {
  statHeaders,
  teamStatHeaders,
  formatDate,
  goalieStatHeaders,
} from '../../utils'
import { TCell } from './TCell'
import colors from '../../styles/colors'

const Container = styled.div`
  max-width: 100%;
  position: relative;
`

const ScrollContainer = styled.div`
  overflow-x: auto;
  margin-left: 175px;
`

const Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 0.875rem;
  width: 100%;
`

const TableHead = styled.thead``
const TableBody = styled.tbody``

const TableRow = styled.tr`
  background-color: ${colors.grey3};
  ${({ header }) => css`
    ${header &&
      css`
        background-color: ${colors.grey1};
      `}

    &:nth-child(even) {
      background-color: ${colors.grey4};
    }
  `}
`

const getHeaders = type => {
  const headerTypeMap = {
    skater: statHeaders,
    goalie: goalieStatHeaders,
    team: teamStatHeaders,
  }

  return headerTypeMap[type]
}

const NewStatsTable = ({ headers, stats, data, dataType }) => {
  const [cellHeights, setCellHeights] = useState([])
  const tableRef = useRef(null)

  useLayoutEffect(() => {
    handleCellHeightResize()
    window.addEventListener('resize', handleCellHeightResize)
    return () => window.removeEventListener('resize', handleCellHeightResize)
  }, [])

  const headersToUse = getHeaders(dataType)

  const getData = (item, header) => {
    if (header === 'gameDate') return formatDate(item[headersToUse[header].id])
    return item[headersToUse[header].id]
  }

  const getTallestCellHeights = () => {
    const rows = Array.from(tableRef.current.getElementsByTagName('tr'))

    return rows.map(row => {
      const fixedCell = row.childNodes[0]
      return Math.max(row.clientHeight, fixedCell.clientHeight)
    })
  }

  const handleCellHeightResize = () => {
    setCellHeights(getTallestCellHeights)
  }

  const headerMarkup = () => (
    <TableRow header>{headers.map(renderHeaderRow)}</TableRow>
  )

  const renderHeaderRow = (header, colIndex) => {
    const text = headersToUse[header].headerText
    const height = cellHeights[0]

    return (
      <TCell
        key={header}
        type='th'
        data={text}
        colIndex={colIndex}
        cellHeight={height}
      />
    )
  }

  const cellMarkup = () =>
    data.map((row, rowIndex) => (
      <TableRow key={row._id}>
        {headers.map((header, colIndex) =>
          renderRow(header, row, rowIndex, colIndex)
        )}
      </TableRow>
    ))

  const renderRow = (header, row, rowIndex, colIndex) => {
    const text = getData(row, header)
    const height = cellHeights[rowIndex + 1]

    return (
      <TCell
        key={header}
        type='td'
        data={text}
        colIndex={colIndex}
        cellHeight={height}
      />
    )
  }

  return (
    <Container>
      <ScrollContainer>
        <Table ref={tableRef}>
          <TableHead>{headerMarkup()}</TableHead>
          <TableBody>{cellMarkup()}</TableBody>
        </Table>
      </ScrollContainer>
    </Container>
  )
}

export default NewStatsTable
