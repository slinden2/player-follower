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
`

const highlightStyling = css`
  background-color: ${colors.grey2};
`

const TableHeader = styled.th`
  ${cellStyling}
  font-size: 1rem;

  ${({ fixed, showPointer, isHighlighted, narrow }) => css`
    ${fixed && fixedCellStyling}
    ${showPointer && 'cursor: pointer;'}
    ${isHighlighted && highlightStyling}
    ${!fixed && 'min-width: 30px;'}
    ${!narrow &&
      fixed &&
      css`
        @media ${breakpoints.narrowStatsTable} {
          min-width: 150px;
        }
      `}
  `}
`
const TableCell = styled.td`
  ${cellStyling}

  ${({ fixed, isHighlighted }) => css`
    ${fixed && fixedCellStyling}
    ${isHighlighted && highlightStyling}
  `}
`

const getCellType = type => {
  const cellTypeMap = {
    th: TableHeader,
    td: TableCell,
  }
  return cellTypeMap[type]
}

export const TCell = ({
  type,
  fixed,
  narrowFixedCol,
  text,
  title,
  onClick,
  isHighlighted,
}) => {
  const Cell = getCellType(type)

  return (
    <Cell
      fixed={fixed}
      narrow={narrowFixedCol}
      title={title}
      onClick={onClick}
      showPointer={onClick}
      isHighlighted={isHighlighted}
    >
      {text}
    </Cell>
  )
}
