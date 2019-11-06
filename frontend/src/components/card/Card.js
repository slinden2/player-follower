import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { event } from '../../utils/tracking'
import PlayerCardFront from './CardFront'
import PlayerCardBack from './CardBack'
import { PlayerContext } from '../../contexts/PlayerContext'

const Container = styled.div`
  position: relative;
  width: 250px;
  height: 310px;
  margin: 0 auto;
  margin-bottom: 16px;

  perspective: 600px;
`

const PlayerCard = React.memo(({ context, data, i, teamSortBy }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [prevSortBy, setPrevSortBy] = useState(null)
  const { sortBy } = useContext(PlayerContext)

  const contextSelector = {
    player: () => ({
      flipEvent: () =>
        event(
          'PLAYER_CARD',
          'Card Flipped',
          `${data.player.firstName} ${data.player.lastName}`
        ),
      sortBy: sortBy,
      statsOnFront: ['POINTS', 'GOALS', 'ASSISTS', 'PLUSMINUS', 'PM'],
    }),
    team: () => ({
      flipEvent: () =>
        event('TEAM_CARD', 'Card Flipped', `${data.team.abbreviation}`),
      sortBy: teamSortBy,
      statsOnFront: ['wins', 'losses', 'otLosses', 'homeRecord', 'awayRecord'],
    }),
  }

  const curContext = contextSelector[context]()

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped)
    curContext.flipEvent()
  }

  // This block is needed to flip cards automatically in base of the
  // sort field.
  if (
    !curContext.statsOnFront.includes(curContext.sortBy) &&
    curContext.sortBy !== prevSortBy
  ) {
    setIsFlipped(true)
    setPrevSortBy(curContext.sortBy)
  } else if (
    curContext.statsOnFront.includes(curContext.sortBy) &&
    curContext.sortBy !== prevSortBy
  ) {
    setIsFlipped(false)
    setPrevSortBy(curContext.sortBy)
  }

  return (
    <Container isFlipped={isFlipped}>
      <PlayerCardFront
        context={context}
        data={data}
        isFlipped={isFlipped}
        handleCardFlip={handleCardFlip}
        i={i}
        sortBy={curContext.sortBy}
      />
      <PlayerCardBack
        context={context}
        data={data}
        isFlipped={isFlipped}
        handleCardFlip={handleCardFlip}
        sortBy={curContext.sortBy}
      />
    </Container>
  )
})

export default PlayerCard
