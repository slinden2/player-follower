import React from 'react'
import styled, { css } from 'styled-components'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'

const cellStyling = css`
  padding: 8px;
  text-align: center;
`

const fixedCellStyling = css`
  text-align: left;
  position: sticky;
  left: 0;
  border-right: 2px solid ${colors.grey1};
  background-color: inherit;

  @media ${breakpoints.narrowStatsTable} {
    min-width: 150px;
  }
`

const TableHeader = styled.th`
  ${cellStyling}
  font-size: 1rem;

  ${({ fixed, showPointer }) => css`
    ${fixed && fixedCellStyling}
    ${showPointer && 'cursor: pointer;'}
  `}
`
const TableCell = styled.td`
  ${cellStyling}

  ${({ fixed }) => css`
    ${fixed && fixedCellStyling}
  `}
`

const getCellType = type => {
  const cellTypeMap = {
    th: TableHeader,
    td: TableCell,
  }
  return cellTypeMap[type]
}

export const TCell = ({ type, colIndex, text, title, onClick }) => {
  const Cell = getCellType(type)

  return (
    <Cell
      fixed={colIndex === 0}
      title={title}
      onClick={onClick}
      showPointer={onClick}
    >
      {text}
    </Cell>
  )
}
