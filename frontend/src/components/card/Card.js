import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { event } from '../../utils/tracking'
import CardFront from './CardFront'
import CardBack from './CardBack'
import { PlayerContext } from '../../contexts/PlayerContext'

const Container = styled.div`
  position: relative;
  width: 250px;
  height: 310px;
  margin: 0 auto;
  margin-bottom: 16px;

  perspective: 600px;
`

const Card = React.memo(({ context, data, i, teamSortBy, dataCy }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [prevSortBy, setPrevSortBy] = useState(null)
  const { sortBy, goalieSortBy } = useContext(PlayerContext)

  const playerFlipEvent = () =>
    event(
      'PLAYER_CARD',
      'Card Flipped',
      `${data.player.firstName} ${data.player.lastName}`
    )

  const contextSelector = {
    player: () => ({
      flipEvent: playerFlipEvent,
      sortBy: sortBy,
      statsOnFront: ['POINTS', 'GOALS', 'ASSISTS', 'PLUSMINUS', 'PM'],
    }),
    goalie: () => ({
      flipEvent: playerFlipEvent,
      sortBy: goalieSortBy,
      statsOnFront: ['WINS', 'LOSSES', 'SHUTOUTS', 'SAVE_PCT', 'GAA'],
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
    <Container isFlipped={isFlipped} data-cy={dataCy}>
      <CardFront
        context={context}
        data={data}
        isFlipped={isFlipped}
        handleCardFlip={handleCardFlip}
        i={i}
        sortBy={curContext.sortBy}
        dataCy='card-front'
      />
      <CardBack
        context={context}
        data={data}
        isFlipped={isFlipped}
        handleCardFlip={handleCardFlip}
        sortBy={curContext.sortBy}
        dataCy='card-back'
      />
    </Container>
  )
})

export default Card
