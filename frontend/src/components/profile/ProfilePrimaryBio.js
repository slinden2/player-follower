import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const List = styled.ul`
  vertical-align: middle;
  line-height: 1.125rem;
  padding: 5px 10px;
  color: ${colors.white1};
  text-transform: uppercase;
  list-style: none;
`

const SecondaryTitle = styled.li`
  font-size: 1rem;
`

const PrimaryTitle = styled.li`
  font-size: 1.625rem;
  line-height: 1.5rem;
  font-weight: bold;
`

const AdditionalInfo = styled.li`
  font-size: 0.875rem;
`

const ProfilePrimaryBio = props => {
  const { primaryTitle, secondaryTitle, primaryInfoString } = props

  return (
    <List data-cy='profile-primary-bio'>
      <SecondaryTitle>{secondaryTitle}</SecondaryTitle>
      <PrimaryTitle>{primaryTitle}</PrimaryTitle>
      <AdditionalInfo>{primaryInfoString()}</AdditionalInfo>
    </List>
  )
}

export default ProfilePrimaryBio
