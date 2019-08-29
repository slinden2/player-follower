import React from 'react'
import styled from 'styled-components'
import Media from 'react-media'
import _ from 'lodash'
import { playerBioData } from '../../utils'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'

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

const bioDataKeysMobile = [
  'primaryPosition',
  'team',
  'nationality',
  'birthDate',
  'birthCity',
  'birthState',
]

const bioDataKeysDesktop = [
  ['primaryPosition', 'team', 'nationality'],
  ['birthDate', 'birthCity', 'birthState'],
]

const PlayerBioTable = ({ player }) => {
  console.log(player)

  const hasProperty = item => player[item.id] !== null

  const createBioTableMobile = () => (
    <BioTable>
      <TableBody>
        <TableRow>
          <TableCellTitle colSpan={2}>{player.fullName}</TableCellTitle>
        </TableRow>
        {bioDataKeysMobile.map(
          key =>
            hasProperty(playerBioData[key]) && (
              <TableRow key={key}>
                <TableCellHeading>{playerBioData[key].title}</TableCellHeading>
                <TableCell>{_.get(player, playerBioData[key].id)}</TableCell>
              </TableRow>
            )
        )}
      </TableBody>
    </BioTable>
  )

  const createBioTableDesktop = () => (
    <BioTable>
      <TableBody>
        <TableRow>
          <TableCellTitle colSpan={6}>{player.fullName}</TableCellTitle>
        </TableRow>
        {bioDataKeysDesktop.map(row => (
          <TableRow>
            {row.map(
              key =>
                hasProperty(playerBioData[key]) && (
                  <>
                    <TableCellHeading>
                      {playerBioData[key].title}
                    </TableCellHeading>
                    <TableCell>
                      {_.get(player, playerBioData[key].id)}
                    </TableCell>
                  </>
                )
            )}
          </TableRow>
        ))}
      </TableBody>
    </BioTable>
  )

  return (
    <Media query={breakpoints.showDesktopNavi}>
      {matches => (matches ? createBioTableDesktop() : createBioTableMobile())}
    </Media>
  )
}

export default PlayerBioTable
