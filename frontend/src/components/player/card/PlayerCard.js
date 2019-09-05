import React, { useState } from 'react'
import styled from 'styled-components'
import colors from '../../../styles/colors'
import PlayerCardFront from './PlayerCardFront'
import PlayerCardBack from './PlayerCardBack'

const Scene = styled.div`
  width: 250px;
  height: 310px;
  perspective: 600px;
  justify-self: center;
`

const SPlayerCard = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid ${colors.grey2};
  border-radius: 10px;
  background: ${colors.grey4};
  box-shadow: 1px 1px 3px 2px rgba(0, 0, 0, 0.15);
  padding: 5px 0px;
  margin: 0 auto;
  margin-bottom: 16px;
  transition: transform 1s;
  transform-style: preserve-3d;
  transition: transform 1s;
  transform-style: preserve-3d;
  ${({ isFlipped }) => isFlipped && 'transform: rotateY(180deg);'}

  & a:hover {
    font-weight: bolder;
  }
`

const PlayerCard = ({ player }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <Scene>
      <SPlayerCard isFlipped={isFlipped}>
        <PlayerCardFront
          player={player}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
        />
        <PlayerCardBack
          player={player}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
        />
      </SPlayerCard>
    </Scene>
  )
}

export default PlayerCard
