import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { positions, playerBioData } from '../../utils'
import colors from '../../styles/colors'

const BioTable = styled.table`
  border-collapse: collapse;
`

const TableBody = styled.tbody``

const TableRow = styled.tr``

const TableCell = styled.td`
  border: 2px solid ${colors.grey3};
  padding: 5px;
`

const TableCellHeading = styled(TableCell)`
  background-color: ${colors.grey2};
`

const TableCellTitle = styled(TableCell)`
  text-align: center;
  font-size: 1.5rem;
  background-color: ${colors.blue1};
  border-width: 0px;
  border-radius: 10px 10px 0 0;
`

const PlayerBioTable = ({ player }) => {
  console.log(player)

  const hasProperty = item => player[item.id] !== null

  const createBioTableMobile = () => (
    <BioTable>
      <TableBody>
        <TableRow>
          <TableCellTitle colSpan={2}>{player.fullName}</TableCellTitle>
        </TableRow>
        {playerBioData.map(
          item =>
            hasProperty(item) && (
              <TableRow key={item.id}>
                <TableCellHeading>{item.title}</TableCellHeading>
                <TableCell>{_.get(player, item.id)}</TableCell>
              </TableRow>
            )
        )}
        <TableRow>
          <TableCellHeading>Position</TableCellHeading>
          <TableCell>{positions[player.primaryPosition]}</TableCell>
        </TableRow>
      </TableBody>
    </BioTable>
  )

  return createBioTableMobile()
}

export default PlayerBioTable
