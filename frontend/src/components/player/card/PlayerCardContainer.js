import React, { useContext } from 'react'
import styled from 'styled-components'
import Loader from '../../elements/Loader'
import { PlayerContext } from '../../../contexts/PlayerContext'
import PlayerCard from './PlayerCard'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 15px;
`

const PlayerCardContainer = ({ queryName }) => {
  const { bestPlayers, favoritePlayers } = useContext(PlayerContext)

  const query = queryName === 'BestPlayers' ? bestPlayers : favoritePlayers

  if (query.loading) {
    return <Loader offset />
  }

  const createRow = playerResults => {
    if (!playerResults.length) return <div>No results</div>

    return playerResults.map((player, i) => (
      <PlayerCard key={player._id} player={player} i={i + 1} />
    ))
  }

  return <Container>{createRow(query.data[queryName])}</Container>
}

export default PlayerCardContainer
