import React from 'react'
import styled from 'styled-components'
import * as S from '../styles'

const PlayerCard = ({ player }) => {
  console.log(player)

  return (
    <S.Card>
      <img src="img/test.png" alt="" />
      <S.NameWrapper>
        <S.CardNumber>#{player.primaryNumber}</S.CardNumber>
        <S.CardFirstName>{player.firstName}</S.CardFirstName>
        <S.CardLastName>{player.lastName}</S.CardLastName>
      </S.NameWrapper>
      <S.StatList>
        <S.StatItem>
          <strong>G:</strong> {player.stats.goals}
        </S.StatItem>
        <S.StatItem>
          <strong>A:</strong> {player.stats.assists}
        </S.StatItem>
        <S.StatItem>
          <strong>P:</strong> {player.stats.points}
        </S.StatItem>
        <S.StatItem>
          <strong>+/-:</strong> {player.stats.plusMinus}
        </S.StatItem>
        <S.StatItem>
          <strong>PM:</strong> {player.stats.penaltyMinutes}
        </S.StatItem>
      </S.StatList>
    </S.Card>
  )
}

export default PlayerCard
