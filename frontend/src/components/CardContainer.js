import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import PlayerCard from './PlayerCard'
import { LAST_GAMES_STATS } from '../graphql/queries'

const CardContainer = () => {
  const playerResults = useQuery(LAST_GAMES_STATS, {
    variables: {
      playerIds: [8477919, 8476329, 8476979, 8475907, 8470619],
    },
  })

  if (playerResults.loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {playerResults.data.getStatsInRange.map(player => (
        <PlayerCard key={player.playerId} player={player} />
      ))}
    </div>
  )
}

export default CardContainer
