import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { event } from '../../../utils/tracking'
import PlayerCardFront from './PlayerCardFront'
import PlayerCardBack from './PlayerCardBack'
import { PlayerContext } from '../../../contexts/PlayerContext'

const Container = styled.div`
  position: relative;
  width: 250px;
  height: 310px;
  margin: 0 auto;
  margin-bottom: 16px;

  perspective: 600px;
`

const frontStats = ['POINTS', 'GOALS', 'ASSISTS', 'PLUSMINUS', 'PM']

const PlayerCard = React.memo(({ player, i }) => {
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
    <Container isFlipped={isFlipped}>
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
        sortBy={sortBy}
      />
    </Container>
  )
})

export default PlayerCard
