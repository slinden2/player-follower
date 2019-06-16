import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import PlayerCard from './PlayerCard'
import { LAST_GAMES_STATS } from '../graphql/queries'

const CardContainer = () => {
  const players = useQuery(LAST_GAMES_STATS, {
    variables: {
      playerIds: [8477919, 8476329, 8476979, 8475907, 8470619],
    },
  })

  console.log(players)

  return (
    <div>
      <PlayerCard />
    </div>
  )
}

export default CardContainer
