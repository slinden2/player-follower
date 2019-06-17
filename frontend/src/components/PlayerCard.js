import React from 'react'
import styled from 'styled-components'
import * as S from '../styles'

const PlayerCard = ({ player }) => {
  console.log(player)

  return (
    <S.Card>
      <p>{player.fullName}</p>
      <S.StatList>
        <S.StatItem>G: {player.stats.goals}</S.StatItem>
        <S.StatItem>A: {player.stats.assists}</S.StatItem>
        <S.StatItem>P: {player.stats.points}</S.StatItem>
        <S.StatItem>+/-: {player.stats.plusMinus}</S.StatItem>
        <S.StatItem>PM: {player.stats.penaltyMinutes}</S.StatItem>
      </S.StatList>
    </S.Card>
  )
}

export default PlayerCard
