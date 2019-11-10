import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { useQuery } from 'react-apollo-hooks'
import { PLAYER_PROFILE, GET_SKATER_STATS, GET_GOALIE_STATS } from '../../graphql/queries'
import PlayerBioTable from './PlayerBioTable'
import PageContainer from '../elements/PageContainer'
import breakpoints from '../../styles/breakpoints'
import Loader from '../elements/Loader'
import { PlayerGameStats } from './PlayerGameStats'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${breakpoints.showDesktopNavi} {
    width: 1000px;
    margin: 0 auto;
  }
`

const PlayerProfile = ({ siteLink }) => {
  const [selectedGamePk, setSelectedGamePk] = useState(null)
  const { data, loading } = useQuery(PLAYER_PROFILE, {
    variables: { siteLink },
  })

  if (loading) {
    return <Loader offset />
  }

  const player = data.findPlayer

  if (!player) {
    return <Redirect to="/404" />
  }

  const isGoalie = player.primaryPosition.code === 'G'

  return (
    <PageContainer title="Player Profile">
      <Container>
        <PlayerBioTable player={player} />
        <PlayerGameStats
          query={isGoalie ? GET_GOALIE_STATS : GET_SKATER_STATS}
          idArray={player.boxscores}
          isGoalie={isGoalie}
          playerId={player.playerId}
          fullName={player.fullName}
        />
      </Container>
    </PageContainer>
  )
}

export default PlayerProfile
