import React from 'react'
import styled from 'styled-components'
import { event } from '../../../utils/tracking'
import colors from '../../../styles/colors'

const Container = styled.div`
  text-align: center;
  margin: 5px auto;

  & span:last-child {
    border-right: 0px;
  }
`

const SelectorItem = styled.span`
  padding: 0 10px;
  border-right: 2px solid ${colors.grey4};
  font-size: 5vw;
  cursor: pointer;
  ${props =>
    props.selected &&
    `text-shadow: 0 0 1px ${colors.white1}, 0 0 1px ${colors.white1},
      0 0 1px ${colors.white1}`};

  @media (min-width: 470px) {
    font-size: 1.5rem;
  }

  &:hover {
    text-shadow: 0 0 1px ${colors.white1}, 0 0 1px ${colors.white1},
      0 0 1px ${colors.white1};
  }
`

const PlayerViewSelector = ({ currentView, setCurrentView }) => {
  const handleViewChange = view => {
    const viewText =
      view === 1 ? 'Last game' : view === 5 ? 'Five games' : 'Ten games'
    setCurrentView(view)
    event('PLAYER_CARD', 'Card view changed', viewText)
  }

  return (
    <Container>
      <SelectorItem
        onClick={() => handleViewChange(1)}
        selected={currentView === 1}
        dataText="Last game"
      >
        Last game
      </SelectorItem>
      <SelectorItem
        onClick={() => handleViewChange(5)}
        selected={currentView === 5}
        dataText="5 games"
      >
        5 games
      </SelectorItem>
      <SelectorItem
        onClick={() => handleViewChange(10)}
        selected={currentView === 10}
        dataText="10 games"
      >
        10 games
      </SelectorItem>
    </Container>
  )
}

export default PlayerViewSelector
