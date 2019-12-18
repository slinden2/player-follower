import React, { useState, useContext } from 'react'
import {
  SKATER_PROFILE,
  GOALIE_PROFILE,
  TEAM_PROFILE,
} from '../../graphql/queries'
import Loader from '../elements/Loader'
import { PlayerContext } from '../../contexts/PlayerContext'
import ProfileMain from './ProfileMain'

const Profile = ({ siteLink, context }) => {
  const [playerContext, setPlayerContext] = useState(null)
  const { allPlayers } = useContext(PlayerContext)

  const { data, loading } = allPlayers

  if (loading) {
    return <Loader offset />
  }

  if (context !== 'team' && !playerContext) {
    const player = data.AllPlayers.find(player => player.siteLink === siteLink)
    setPlayerContext(player.primaryPosition.code === 'G' ? 'goalie' : 'skater')
  }

  const querySelector = {
    skater: SKATER_PROFILE,
    goalie: GOALIE_PROFILE,
    team: TEAM_PROFILE,
  }

  const query = querySelector[context || playerContext]

  return (
    <ProfileMain
      siteLink={siteLink}
      context={context || playerContext}
      query={query}
    />
  )
}

export default Profile
