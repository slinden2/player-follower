import React, { useState } from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const Row = styled.tr`
  ${props => props.showPointer && 'cursor: pointer;'}

  & td {
    cursor: ${props => props.highlight && 'pointer'};
    background-color: ${props => props.highlight && colors.grey2};
  }
`

const TableRow = ({ children, data, showPointer, handleRowClick }) => {
  const [highlightRowClick, setHighlightRowClick] = useState(false)
  const [highlightRowHover, setHighlightRowHover] = useState(false)

  const changeState = () => {
    setHighlightRowClick(!highlightRowClick)
    // Need to set hover to false, because otherwise it would be true
    // after the last touch on mobile.
    setHighlightRowHover(false)
  }

  const handleClick = () => {
    return handleRowClick ? handleRowClick(data) : changeState()
  }

  return (
    <Row
      onClick={handleClick}
      onMouseEnter={() => setHighlightRowHover(true)}
      onMouseLeave={() => setHighlightRowHover(false)}
      highlight={highlightRowHover || highlightRowClick}
      showPointer={showPointer}
    >
      {children}
    </Row>
  )
}

export default TableRow
