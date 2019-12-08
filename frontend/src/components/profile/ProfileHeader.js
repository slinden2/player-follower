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

const ProfileHeader = props => {
  const {
    primaryTitle,
    secondaryTitle,
    additionalInfo1,
    headers,
    stats,
  } = props

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
