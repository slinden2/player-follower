import React from 'react'
import styled from 'styled-components'
import { event } from '../../utils/tracking'
import colors from '../../styles/colors'

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

const ViewSelector = ({ currentView, setCurrentView, numbers, context }) => {
  const handleViewChange = view => {
    const viewText =
      view === 1
        ? 'Last game'
        : view === 3
        ? 'Three games'
        : view === 5
        ? 'Five games'
        : 'Ten games'
    setCurrentView(view)
    event(context, 'Card view changed', viewText)
  }

  return (
    <Container>
      <SelectorItem
        onClick={() => handleViewChange(numbers[0])}
        selected={currentView === numbers[0]}
      >
        {numbers[0] === 1 ? 'Last game' : `${numbers[0]} games`}
      </SelectorItem>
      <SelectorItem
        onClick={() => handleViewChange(numbers[1])}
        selected={currentView === numbers[1]}
      >
        {`${numbers[1]} games`}
      </SelectorItem>
      <SelectorItem
        onClick={() => handleViewChange(numbers[2])}
        selected={currentView === numbers[2]}
      >
        {`${numbers[2]} games`}
      </SelectorItem>
    </Container>
  )
}

export default ViewSelector
