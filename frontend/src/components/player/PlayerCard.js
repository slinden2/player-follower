import React, { useState } from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const SPlayerCard = styled.div`
  position: relative;
  width: 250px;
  height: 310px;
  border: 1px solid ${colors.grey2};
  border-radius: 10px;
  background: ${colors.grey4};
  box-shadow: 1px 1px 3px 2px rgba(0, 0, 0, 0.15);
  padding: 5px 0px;
  margin: 0 auto;
  margin-bottom: 16px;
  overflow: hidden;

  & a:hover {
    font-weight: bolder;
  }
`

const FlipDiv = styled.div`
  position: absolute;
  background-color: ${colors.red1};
  padding: 4px 25px;
  padding-bottom: 10px;
  transform: rotate(-45deg);
  left: 198px;
  bottom: -5px;
`

const PlayerCard = props => {
  const [showFront, setShowFront] = useState(true)

  return (
    <SPlayerCard>
      {showFront ? props.children[0] : props.children[1]}
      <FlipDiv onClick={() => setShowFront(!showFront)}>Flip</FlipDiv>
    </SPlayerCard>
  )
}

export default PlayerCard
