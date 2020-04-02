import React from 'react'
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
  ${({ header, onClick }) => css`
    ${header &&
      css`
        background-color: ${colors.grey1};
      `}

    ${onClick &&
      css`
        cursor: pointer;
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
  onRowClick,
  stats, // needed on profile page as column totals
  statHeaders, // needed on profile page as column totals
}) => {
  const headersToUse = getHeaders(dataType)

  // If the sort is done in the back end the sort prop is different
  const sortProp = apiSort ? 'sortString' : 'id'

  const getData = (item, header) => {
    if (header === 'gameDate') return formatDate(item[headersToUse[header].id])
    if (header === 'total') return headersToUse[header].headerText
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
    const fixed = colIndex === 0
    const isHighlighted = highlightColumn(header) && !fixed
    // PlayerProfile stats table must have narrower first column
    const narrowFixedCol = fixed && text === 'Date'

    const handleSort = sortBy => {
      sortDispatch({ type: 'SORT_BY', sortBy })
    }

    return (
      <TCell
        key={header}
        type='th'
        text={text}
        title={title}
        fixed={fixed}
        narrowFixedCol={narrowFixedCol}
        onClick={sortEnabled ? () => handleSort(sortBy) : undefined}
        isHighlighted={isHighlighted}
      />
    )
  }

  const cellMarkup = () =>
    data.map(row => (
      <TableRow
        key={row._id || row.id}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
      >
        {headers.map((header, colIndex) => renderRow(header, row, colIndex))}
      </TableRow>
    ))

  const statsRowMarkup = () => (
    <TableRow>
      {statHeaders.map((header, colIndex) =>
        renderRow(header, stats, colIndex, true)
      )}
    </TableRow>
  )

  const renderRow = (header, row, colIndex, isTotalRow) => {
    const text = getData(row, header)
    const fixed = colIndex === 0
    const isHighlighted = highlightColumn(header) && !fixed
    const addColSpan = colIndex === 0 && isTotalRow
    const colSpan = addColSpan ? 2 : undefined

    return (
      <TCell
        key={header}
        type='td'
        text={text}
        fixed={fixed}
        isHighlighted={isHighlighted}
        isTotalRow={isTotalRow}
        colSpan={colSpan}
      />
    )
  }

  return (
    <Container>
      {title && <Title>{title}</Title>}
      <ScrollContainer>
        <Table data-cy='stat-table'>
          <TableHead>{headerMarkup()}</TableHead>
          <TableBody>
            {cellMarkup()}
            {stats && statsRowMarkup()}
          </TableBody>
        </Table>
      </ScrollContainer>
    </Container>
  )
}

export default NewStatsTable
