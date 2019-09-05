import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
import { TEAM_PROFILE } from '../../graphql/queries'
import PageContainer from '../elements/PageContainer'
import StatsTable from '../StatsTable'
import { playerStatsHeaders } from '../../utils'

const TeamProfile = ({ siteLink }) => {
  const [sortVariables, setSortVariables] = useState({
    offset: 0,
    sortBy: 'points',
    sortDir: 'DESC',
  })
  const { data, loading } = useQuery(TEAM_PROFILE, {
    variables: { siteLink },
  })

  if (loading) {
    return <div>Loading...</div>
  }

  const sortPlayers = players => {
    const sortedPlayers = players.sort((a, b) => {
      let sort
      sortVariables.sortDir === 'DESC'
        ? (sort = b[sortVariables.sortBy] - a[sortVariables.sortBy])
        : (sort = a[sortVariables.sortBy] - b[sortVariables.sortBy])
      return sort
    })
    return sortedPlayers
  }

  const index = playerStatsHeaders.indexOf('team')
  const headers = playerStatsHeaders
    .slice(0, index)
    .concat(playerStatsHeaders.slice(index + 1))

  const playersWithLink = data.GetTeam.rosterStats.map(player => ({
    ...player,
    fullName: <Link to={`/players/${player.siteLink}`}>{player.fullName}</Link>,
  }))

  return (
    <PageContainer title={data.GetTeam.name}>
      <StatsTable
        title="Player performance"
        headers={headers}
        data={sortPlayers(playersWithLink)}
        sortVariables={sortVariables}
        setSortVariables={setSortVariables}
        sortOnClient={true}
      />
    </PageContainer>
  )
}

export default TeamProfile
