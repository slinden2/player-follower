import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'
import ProfilePrimaryBio from './ProfilePrimaryBio'
import ProfilePrimaryStats from './ProfilePrimaryStats'
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
    primaryInfoString,
    headers,
    stats,
  } = props

  return (
    <Container>
      <ProfilePrimaryBio
        primaryTitle={primaryTitle}
        secondaryTitle={secondaryTitle}
        primaryInfoString={primaryInfoString}
      />
      <Media query={breakpoints.profileWide}>
        <ProfilePrimaryStats headers={headers} stats={stats} />
      </Media>
    </Container>
  )
}

export default ProfileHeader
