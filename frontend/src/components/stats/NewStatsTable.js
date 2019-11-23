import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import {
  statHeaders,
  teamStatHeaders,
  formatDate,
  goalieStatHeaders,
} from '../../utils'
import { TCell } from './TCell'
import Title from '../elements/Title'
import colors from '../../styles/colors'

const Container = styled.div`
  max-width: 100%;
  position: relative;
`

const ScrollContainer = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  border-spacing: 0;
  font-size: 0.875rem;
  width: 100%;
  border-top: 3px solid ${colors.grey1};
  border-bottom: 3px solid ${colors.grey1};
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

const disabledSortVariables = [
  'TEAM',
  'POSITION',
  'fullName',
  'team',
  'position',
  'teamName',
]

const NewStatsTable = ({
  title,
  headers,
  data,
  dataType,
  sortVars,
  sortDispatch,
  apiSort,
}) => {
  const headersToUse = getHeaders(dataType)

  // If the sort is done in the back end the sort prop is different
  const sortProp = apiSort ? 'sortString' : 'id'

  const getData = (item, header) => {
    if (header === 'gameDate') return formatDate(item[headersToUse[header].id])
    return item[headersToUse[header].id]
  }

  const highlightColumn = header =>
    sortVars && sortVars.sortBy === headersToUse[header][sortProp]

  const headerMarkup = () => (
    <TableRow header>{headers.map(renderHeaderRow)}</TableRow>
  )

  const renderHeaderRow = (header, colIndex) => {
    const text = headersToUse[header].headerText
    const title = headersToUse[header].title
    const sortBy = headersToUse[header][sortProp]
    const sortEnabled = !disabledSortVariables.includes(sortBy)
    const isHighlighted = highlightColumn(header)

    const handleSort = sortBy => {
      sortDispatch({ type: 'SORT_BY', sortBy })
    }

    return (
      <TCell
        key={header}
        type='th'
        text={text}
        title={title}
        colIndex={colIndex}
        onClick={sortEnabled ? () => handleSort(sortBy) : undefined}
        isHighlighted={isHighlighted}
      />
    )
  }

  const cellMarkup = () =>
    data.map((row, rowIndex) => (
      <TableRow key={row._id}>
        {headers.map((header, colIndex) => renderRow(header, row, colIndex))}
      </TableRow>
    ))

  const renderRow = (header, row, colIndex) => {
    const text = getData(row, header)
    const isHighlighted = highlightColumn(header)

    return (
      <TCell
        key={header}
        type='td'
        text={text}
        colIndex={colIndex}
        isHighlighted={isHighlighted}
      />
    )
  }

  return (
    <Container>
      {title && <Title>{title}</Title>}
      <ScrollContainer>
        <Table>
          <TableHead>{headerMarkup()}</TableHead>
          <TableBody>{cellMarkup()}</TableBody>
        </Table>
      </ScrollContainer>
    </Container>
  )
}

export default NewStatsTable
