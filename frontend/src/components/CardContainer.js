import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import PlayerCard from './PlayerCard'
import { LAST_GAMES_STATS } from '../graphql/queries'
import * as S from '../styles'

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
    <S.RedBorder>
      <h1>First Stats</h1>
      <S.CardRow>
        {playerResults.data.getStatsInRange.map(player => (
          <S.Card key={player.playerId}>
            <PlayerCard key={player.playerId} player={player} />
          </S.Card>
        ))}
      </S.CardRow>
    </S.RedBorder>
  )
}

export default CardContainer
