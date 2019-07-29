import React, { useState } from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const SPlayerCard = styled.div`
  width: 250px;
  height: 300px;
  border: 1px solid ${colors.grey2};
  border-radius: 10px;
  background: ${colors.grey4};
  box-shadow: 1px 1px 3px 2px rgba(0, 0, 0, 0.15);
  padding: 5px;
  margin: 0 auto;
`

const PlayerCard = props => {
  const [showFront, setShowFront] = useState(true)

  return (
    <SPlayerCard>
      {showFront ? props.children[0] : props.children[1]}
      <div onClick={() => setShowFront(!showFront)}>Flip</div>
    </SPlayerCard>
  )
}

export default PlayerCard
