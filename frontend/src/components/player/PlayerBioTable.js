import React, { Fragment } from 'react'
import styled from 'styled-components'
import Media from 'react-media'
import _ from 'lodash'
import { playerBioData } from '../../utils'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'

const BioTable = styled.table`
  border-collapse: collapse;
  margin-bottom: 10px;
`

const TableBody = styled.tbody``

const TableRow = styled.tr``

const TableCell = styled.td`
  border: 2px solid ${colors.grey3};
  padding: 5px;
`

const TableCellHeading = styled(TableCell)`
  background-color: ${colors.grey1};
  font-weight: bolder;
`

const TableCellTitle = styled(TableCell)`
  text-align: center;
  font-size: 1.5rem;
  background-color: ${colors.blue1};
  border-width: 0px;
  border-radius: 10px 10px 0 0;
`

const bioDataKeysNarrow = [
  ['primaryPosition'],
  ['team'],
  ['primaryNumber'],
  ['birthDate'],
  ['birthCity'],
  ['birthState'],
  ['nationality'],
  ['height'],
  ['weight'],
]

const bioDataKeysMedium = [
  ['primaryPosition', 'team'],
  ['primaryNumber', 'birthDate'],
  ['birthCity', 'birthState'],
  ['nationality'],
  ['height', 'weight'],
]

const bioDataKeysWide = [
  ['primaryPosition', 'team', 'primaryNumber'],
  ['birthDate', 'birthCity', 'birthState'],
  ['nationality', 'height', 'weight'],
]

const createHeight = heightCm => {
  const floatFeet = (heightCm * 0.3937) / 12
  const feet = Math.floor(floatFeet)
  const inch = Math.round((floatFeet - feet) * 12)
  return `${feet}'${inch}" / ${heightCm}cm`
}

const createWeight = weightKg => {
  const weightLbs = Math.round(weightKg * 2.20462262)
  return `${weightLbs}lbs / ${weightKg}kg`
}
const playerWithUnits = player => {
  const newPlayer = {
    ...player,
    weight: createWeight(player.weight),
    height: createHeight(player.height),
  }
  return newPlayer
}

const PlayerBioTable = ({ player }) => {
  const newPlayer = playerWithUnits(player)
  console.log(newPlayer)

  const hasProperty = item => newPlayer[item.id] !== null

  const createBioTable = data => (
    <BioTable>
      <TableBody>
        <TableRow>
          <TableCellTitle colSpan={6}>{newPlayer.fullName}</TableCellTitle>
        </TableRow>
        {data.map((row, i) => (
          <TableRow key={i}>
            {row.map(
              key =>
                hasProperty(playerBioData[key]) && (
                  <Fragment key={key}>
                    <TableCellHeading>
                      {playerBioData[key].title}
                    </TableCellHeading>
                    <TableCell>
                      {_.get(newPlayer, playerBioData[key].id)}
                    </TableCell>
                  </Fragment>
                )
            )}
          </TableRow>
        ))}
      </TableBody>
    </BioTable>
  )

  return (
    <Media query={breakpoints.showDesktopNavi}>
      {matches =>
        matches ? (
          createBioTable(bioDataKeysWide)
        ) : (
          <Media query={breakpoints.narrowBioTable}>
            {matches =>
              matches
                ? createBioTable(bioDataKeysNarrow)
                : createBioTable(bioDataKeysMedium)
            }
          </Media>
        )
      }
    </Media>
  )
}

export default PlayerBioTable
