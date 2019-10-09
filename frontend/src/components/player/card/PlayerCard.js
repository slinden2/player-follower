import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { event } from '../../../utils/tracking'
import colors from '../../../styles/colors'
import PlayerCardFront from './PlayerCardFront'
import PlayerCardBack from './PlayerCardBack'
import { PlayerContext } from '../../../contexts/PlayerContext'

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
  ${({ isFlipped }) => isFlipped && 'transform: rotateY(180deg);'}

  & a:hover {
    font-weight: bolder;
  }
`

const frontStats = ['POINTS', 'GOALS', 'ASSISTS', 'PLUSMINUS', 'PM']

const PlayerCard = ({ player, i }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [prevSortBy, setPrevSortBy] = useState(null)
  const { sortBy } = useContext(PlayerContext)

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped)
    event(
      'PLAYER_CARD',
      'Card Flipped',
      `${player.player.firstName} ${player.player.lastName}`
    )
  }

  // This block is needed to flip cards automatically in base of the
  // sort field.
  if (!frontStats.includes(sortBy) && sortBy !== prevSortBy) {
    setIsFlipped(true)
    setPrevSortBy(sortBy)
  } else if (frontStats.includes(sortBy) && sortBy !== prevSortBy) {
    setIsFlipped(false)
    setPrevSortBy(sortBy)
  }

  return (
    <Scene>
      <SPlayerCard isFlipped={isFlipped}>
        <PlayerCardFront
          player={player}
          isFlipped={isFlipped}
          handleCardFlip={handleCardFlip}
          i={i}
          sortBy={sortBy}
        />
        <PlayerCardBack
          player={player}
          isFlipped={isFlipped}
          handleCardFlip={handleCardFlip}
        />
      </SPlayerCard>
    </Scene>
  )
}

export default PlayerCard
