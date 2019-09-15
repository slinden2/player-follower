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
  ${props => props.selected && 'font-weight: bold'};

  @media (min-width: 470px) {
    font-size: 1.5rem;
  }
  &:hover {
    font-weight: bolder;
  }
`

const PlayerViewSelector = ({ currentView, setCurrentView }) => {
  const handleViewChange = view => {
    setCurrentView(view)
    event('PLAYER_CARD', 'Card view changed', view)
  }

  return (
    <Container>
      <SelectorItem
        onClick={() => handleViewChange('Last game')}
        selected={currentView === 'Last game'}
      >
        Last game
      </SelectorItem>
      <SelectorItem
        onClick={() => handleViewChange('Five games')}
        selected={currentView === 'Five games'}
      >
        5 games
      </SelectorItem>
      <SelectorItem
        onClick={() => handleViewChange('Ten games')}
        selected={currentView === 'Ten games'}
      >
        10 games
      </SelectorItem>
    </Container>
  )
}

export default PlayerViewSelector
