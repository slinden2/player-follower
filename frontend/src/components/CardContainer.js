import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import PlayerCard from './PlayerCard'
import { LAST_GAMES_STATS } from '../graphql/queries'

const CardContainer = () => {
  const player1 = useQuery(LAST_GAMES_STATS, {
    variables: { playerId: 8477919 },
  })
  const player2 = useQuery(LAST_GAMES_STATS, {
    variables: { playerId: 8476329 },
  })
  const player3 = useQuery(LAST_GAMES_STATS, {
    variables: { playerId: 8476979 },
  })
  const player4 = useQuery(LAST_GAMES_STATS, {
    variables: { playerId: 8475907 },
  })
  const player5 = useQuery(LAST_GAMES_STATS, {
    variables: { playerId: 8470619 },
  })

  const players = [player1, player2, player3, player4, player5]

  console.log(players)

  return (
    <div>
      <PlayerCard />
    </div>
  )
}

export default CardContainer
