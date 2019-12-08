import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'
import GeneralData from './GeneralData'
import { MainStats } from './MainStats'
import { statHeaders, goalieStatHeaders, teamStatHeaders } from '../../utils'
import Media from 'react-media'
import breakpoints from '../../styles/breakpoints'

const Container = styled.div`
  display: flex;
  width: 100%;
  background-color: ${colors.grey4};
  border-radius: 10px;
`

const ProfileHeader = ({
  primaryTitle,
  secondaryTitle,
  additionalInfo1,
  headers,
  stats,
}) => {
  // const contextSelector = {
  //   skater: () => ({
  //     primaryTitle: data.lastName,
  //     secondaryTitle: data.firstName,
  //     additionalInfo1: `#${data.primaryNumber}, ${data.primaryPosition.abbreviation}`,
  //     headers: statHeaders,
  //     stats: [
  //       { id: 'gamesPlayed', value: data.stats.gamesPlayed },
  //       { id: 'goals', value: data.stats.goals },
  //       { id: 'points', value: data.stats.points },
  //     ],
  //   }),
  //   goalie: () => ({
  //     primaryTitle: data.lastName,
  //     secondaryTitle: data.firstName,
  //     additionalInfo1: `#${data.primaryNumber}, ${data.primaryPosition.abbreviation}`,
  //     headers: goalieStatHeaders,
  //     stats: [
  //       { id: 'gamesPlayed', value: data.stats.gamesPlayed },
  //       { id: 'goalsAgainstAverage', value: data.stats.goalsAgainstAverage },
  //       { id: 'savePct', value: data.stats.savePct },
  //     ],
  //   }),
  //   team: () => ({
  //     primaryTitle: data.teamName,
  //     secondaryTitle: data.locationName,
  //     additionalInfo1: `${data.conference.name}, ${data.division.name}`,
  //     headers: teamStatHeaders,
  //     stats: [
  //       { id: 'goalsFor', value: data.stats.goalsFor },
  //       { id: 'goalsAgainst', value: data.stats.goalsAgainst },
  //       { id: 'ppPct', value: data.stats.ppPct },
  //       { id: 'pkPct', value: data.stats.pkPct },
  //     ],
  //   }),
  // }

  // const curContext = contextSelector[context]()

  return (
    <Container>
      <GeneralData
        primaryTitle={primaryTitle}
        secondaryTitle={secondaryTitle}
        additionalInfo1={additionalInfo1}
      />
      <Media query={breakpoints.profileWide}>
        <MainStats headers={headers} stats={stats} />
      </Media>
    </Container>
  )
}

export default ProfileHeader
