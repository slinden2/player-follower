import React, { useReducer } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { TEAM_PROFILE } from '../../graphql/queries'
import PageContainer from '../elements/PageContainer'
import NewStatsTable from '../stats/NewStatsTable'
import { playerStatsHeaders } from '../../utils'
import Loader from '../elements/Loader'
import sortReducer from '../../reducers/sortReducer'

const initialSortState = {
  positionFilter: 'ALL', // not in use
  teamFilter: 'ALL', // not in use
  nationalityFilter: 'ALL', // not in use
  offset: 0,
  sortBy: 'points',
  sortDir: 'DESC',
}

const TeamProfile = ({ siteLink }) => {
  const [sortVars, dispatch] = useReducer(sortReducer, initialSortState)
  const { data, loading } = useQuery(TEAM_PROFILE, {
    variables: { siteLink },
  })

  if (loading) {
    return <Loader offset />
  }

  if (!data.GetTeam) {
    return <Redirect to='/404' />
  }

  const sortPlayers = players => {
    const sortedPlayers = players.sort((a, b) => {
      let sort
      sortVars.sortDir === 'DESC'
        ? (sort = b[sortVars.sortBy] - a[sortVars.sortBy])
        : (sort = a[sortVars.sortBy] - b[sortVars.sortBy])
      return sort
    })
    return sortedPlayers
  }

  const index = playerStatsHeaders.indexOf('team')
  const headers = playerStatsHeaders
    .slice(0, index)
    .concat(playerStatsHeaders.slice(index + 1))

  const playersWithLink = data.GetTeam.players.map(player => ({
    ...player,
    fullName: <Link to={`/players/${player.siteLink}`}>{player.fullName}</Link>,
  }))

  return (
    <PageContainer title={data.GetTeam.name}>
      <NewStatsTable
        title='Player Stats'
        headers={headers}
        data={sortPlayers(playersWithLink)}
        dataType='skater'
        sortVars={sortVars}
        sortDispatch={dispatch}
      />
    </PageContainer>
  )
}

export default TeamProfile
