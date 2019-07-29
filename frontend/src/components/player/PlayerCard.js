import React, { useState } from 'react'
import { Card } from 'semantic-ui-react'

const PlayerCard = props => {
  const [showFront, setShowFront] = useState(true)

  return (
    <Card>
      {showFront ? props.children[0] : props.children[1]}
      <div onClick={() => setShowFront(!showFront)}>Flip</div>
    </Card>
  )
}

export default PlayerCard
