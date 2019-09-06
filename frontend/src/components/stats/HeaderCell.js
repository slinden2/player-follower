import React from 'react'
import styled from 'styled-components'
import CellStyling from './CellStyling'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'

const Header = styled.th`
  ${CellStyling}
  background-color: ${colors.grey1};
  ${props => props.showPointer && 'cursor: pointer;'}

  @media ${breakpoints.hideOnMobile} {
    ${props => !props.showOnMobile && 'display: none'};
  }

  @media ${breakpoints.showDesktopNavi} {
    font-size: 0.875rem;
  }
`

// cant sort by these fields atm because of
// how aggregation is done in the backend
const disableSortVariables = [
  'PLAYER',
  'TEAM',
  'POSITION',
  'fullName',
  'team',
  'position',
  'teamName',
]

const HeaderCell = ({
  header,
  columnData,
  sortOnClient,
  sortVariables,
  setSortVariables,
  showOnMobile,
}) => {
  const sortDisabled = !sortVariables
  const sortProp = sortOnClient ? 'id' : 'sortString'

  const handleNewVariables = sortBy => {
    if (disableSortVariables.includes(sortBy) || sortDisabled) return
    if (sortBy === sortVariables.sortBy) {
      sortVariables.sortDir === 'DESC'
        ? setSortVariables({ offset: 0, sortBy, sortDir: 'ASC' })
        : setSortVariables({ offset: 0, sortBy, sortDir: 'DESC' })
    } else {
      setSortVariables({ offset: 0, sortBy, sortDir: 'DESC' })
    }
  }

  return (
    <Header
      onClick={() => handleNewVariables(columnData[header][sortProp])}
      title={columnData[header].title}
      showOnMobile={showOnMobile}
      showPointer={
        sortVariables &&
        !disableSortVariables.includes(columnData[header][sortProp])
      }
    >
      {columnData[header].headerText}
    </Header>
  )
}

export default HeaderCell
