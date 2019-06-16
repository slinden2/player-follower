import React from 'react'
import styled from 'styled-components'

const PlayerCard = ({ player }) => {
  console.log(player)

  return <h1>{player.fullName}</h1>
}

export default PlayerCard
