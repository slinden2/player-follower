import React, { useState } from 'react'
import styled from 'styled-components'
import Media from 'react-media'
import { useQuery } from 'react-apollo-hooks'
import { profileImgUrl } from '../../utils'
import { PLAYER_PROFILE } from '../../graphql/queries'
import PlayerBioTable from './PlayerBioTable'
import StatsTable from '../stats/StatsTable'
import PlayerMilestones from './PlayerMilestones'
import PageContainer from '../elements/PageContainer'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'
import fallbackImg from '../../assets/noimg.png'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${breakpoints.showDesktopNavi} {
    width: 1000px;
    margin: 0 auto;
  }
`

const ActionImg = styled.img`
  width: 100%;
  max-width: 1000px;
  border: 3px solid ${colors.grey3};
  border-radius: 5px;
  margin-bottom: 10px;
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
  'shotPct',
  'blocked',
  'hits',
  'giveaways',
  'takeaways',
]

const sortBoxscoresByDate = boxscores => {
  return boxscores.sort((a, b) => {
    a = a.gameDate.split('/').join('')
    b = b.gameDate.split('/').join('')
    return a < b ? 1 : a > b ? -1 : 0
  })
}

const handleImgNotFound = e => {
  e.target.src = fallbackImg
}

const PlayerProfile = ({ siteLink }) => {
  const [selectedGamePk, setSelectedGamePk] = useState(null)
  const { data, loading } = useQuery(PLAYER_PROFILE, {
    variables: { siteLink },
  })

  if (loading) {
    return <div>Loading...</div>
  }

  const player = data.findPlayer
  player.boxscores = sortBoxscoresByDate(player.boxscores)
  player.boxscores = player.boxscores.map(boxscore => ({
    ...boxscore,
    teams:
      boxscore.awayTeam.abbreviation + '@' + boxscore.homeTeam.abbreviation,
  }))
  const gamePks = player.boxscores.map(boxscore => boxscore.gamePk)

  const handleRowClick = rowData => {
    setSelectedGamePk([rowData.gamePk])
  }

  return (
    <PageContainer title="Player Profile">
      <Container>
        <ActionImg
          src={profileImgUrl(data.findPlayer.playerId)}
          onError={handleImgNotFound}
        />
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
        <PlayerMilestones
          playerId={player.playerId}
          gamePks={gamePks.slice(0, 5)}
          selectedGamePk={selectedGamePk}
          setSelectedGamePk={setSelectedGamePk}
          boxscores={player.boxscores}
        />
      </Container>
    </PageContainer>
  )
}

export default PlayerProfile
