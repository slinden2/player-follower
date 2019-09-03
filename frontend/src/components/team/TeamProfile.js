import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { TEAM_PROFILE } from '../../graphql/queries'
import PageContainer from '../elements/PageContainer'

const TeamProfile = ({ siteLink }) => {
  const { data, loading } = useQuery(TEAM_PROFILE, {
    variables: { siteLink },
  })

  if (loading) {
    return <div>Loading...</div>
  }

  console.log(data)

  return <PageContainer title="Team"></PageContainer>
}

export default TeamProfile
