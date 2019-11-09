import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Media from 'react-media'
import { useQuery } from 'react-apollo-hooks'
import { PLAYER_PROFILE } from '../../graphql/queries'
import PlayerBioTable from './PlayerBioTable'
import StatsTable from '../stats/StatsTable'
import PlayerMilestones from './PlayerMilestones'
import PageContainer from '../elements/PageContainer'
import breakpoints from '../../styles/breakpoints'
import Loader from '../elements/Loader'
import Rink from './rink/Rink'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${breakpoints.showDesktopNavi} {
    width: 1000px;
    margin: 0 auto;
  }
`

const headers = [
  'gameDate',
  'teams',
  'goals',
  'assists',
  'points',
  'plusMinus',
  'penaltyMinutes',
  'powerPlayGoals',
  'powerPlayAssists',
  'shortHandedGoals',
  'shortHandedAssists',
  'timeOnIce',
  'powerPlayTimeOnIce',
  'shortHandedTimeOnIce',
  'shots',
  'blocked',
  'hits',
  'giveaways',
  'takeaways',
]

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

  player.boxscores = player.boxscores.sort((a, b) => b.gamePk - a.gamePk)
  player.boxscores = player.boxscores.map(boxscore => ({
    ...boxscore,
    teams:
      boxscore.awayTeam.abbreviation + '@' + boxscore.homeTeam.abbreviation,
  }))
  const gamePks = player.boxscores.map(boxscore => boxscore.gamePk)

  // Temp fix. The videos of the new games do not work!
  const filteredGamePks = gamePks.filter(gamePk => gamePk < 2019020248)

  const handleRowClick = rowData => {
    if (rowData.gamePk < 2019020248) setSelectedGamePk([rowData.gamePk])
  }

  return (
    <PageContainer title="Player Profile">
      <Container>
        <PlayerBioTable player={player} />
        <Media query={breakpoints.showDesktopNavi}>
          {matches =>
            matches ? (
              <StatsTable
                title="Performance Game-by-Game"
                headers={headers}
                data={player.boxscores}
                handleRowClick={handleRowClick}
              />
            ) : (
              <StatsTable
                title="Performance Game-by-Game"
                headers={headers.slice(0, 7)}
                data={player.boxscores}
                handleRowClick={handleRowClick}
              />
            )
          }
        </Media>
        <Rink data={player.goals} />
        <PlayerMilestones
          playerId={player.playerId}
          fullName={player.fullName}
          gamePks={filteredGamePks.slice(0, 5)}
          selectedGamePk={selectedGamePk}
          setSelectedGamePk={setSelectedGamePk}
          boxscores={player.boxscores}
        />
      </Container>
    </PageContainer>
  )
}

export default PlayerProfile
