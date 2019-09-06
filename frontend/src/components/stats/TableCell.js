import React from 'react'
import styled from 'styled-components'
import CellStyling from './CellStyling'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'

const Cell = styled.td`
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

const TableCell = ({ data, highlight, showOnMobile, leftAlign }) => {
  return (
    <Cell
      highlight={highlight}
      showOnMobile={showOnMobile}
      leftAlign={leftAlign}
    >
      {data}
    </Cell>
  )
}

export default TableCell
