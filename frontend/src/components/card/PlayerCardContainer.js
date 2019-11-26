import React from 'react'
import styled from 'styled-components'
import Loader from '../elements/Loader'
import Card from './Card'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 15px;
`

const PlayerCardContainer = ({ query, queryName, numOfCards }) => {
  if (query.loading) {
    return <Loader offset />
  }

  const context = queryName === 'BestGoalies' ? 'goalie' : 'player'

  const createRow = playerResults => {
    if (!playerResults.length) return <div>No results</div>
    playerResults = playerResults.slice(0, numOfCards)
    return playerResults.map((player, i) => (
      <Card key={player._id} context={context} data={player} i={i + 1} />
    ))
  }

  return <Container>{createRow(query.data[queryName])}</Container>
}

export default PlayerCardContainer
