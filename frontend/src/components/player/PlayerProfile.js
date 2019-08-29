import React, { useState } from 'react'
import styled from 'styled-components'
import Media from 'react-media'
import { useQuery } from 'react-apollo-hooks'
import { Loader } from 'semantic-ui-react'
import { profileImgUrl } from '../../utils'
import { PLAYER_PROFILE } from '../../graphql/queries'
import PlayerBioTable from './PlayerBioTable'
import StatsTable from '../StatsTable'
import PlayerMilestones from './PlayerMilestones'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'

const Container = styled.div`
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ActionImg = styled.img`
  width: 100%;
  max-width: 1000px;
  border: 3px solid ${colors.grey3};
  border-radius: 5px;
  margin-bottom: 10px;
`

const headers = [
  { headerText: 'Date', id: 'gameDate' },
  { headerText: 'Teams', id: 'teams' },
  { headerText: 'G', id: 'goals' },
  { headerText: 'A', id: 'assists' },
  { headerText: 'P', id: 'points' },
  { headerText: '+/-', id: 'plusMinus' },
  { headerText: 'PM', id: 'penaltyMinutes' },
  { headerText: 'PPG', id: 'powerPlayGoals' },
  { headerText: 'PPA', id: 'powerPlayAssists' },
  { headerText: 'SHG', id: 'shortHandedGoals' },
  { headerText: 'SHA', id: 'shortHandedAssists' },
  { headerText: 'TON', id: 'timeOnIce' },
  { headerText: 'PPTON', id: 'powerPlayTimeOnIce' },
  { headerText: 'SHTON', id: 'shortHandedTimeOnIce' },
  { headerText: 'Shots', id: 'shots' },
  { headerText: 'Shot%', id: 'shotPct' },
  { headerText: 'Blocked', id: 'blocked' },
  { headerText: 'Hits', id: 'hits' },
  { headerText: 'Giveaways', id: 'giveaways' },
  { headerText: 'Takeaways', id: 'takeaways' },
]

const sortBoxscoresByDate = boxscores => {
  return boxscores.sort((a, b) => {
    a = a.gameDate.split('/').join('')
    b = b.gameDate.split('/').join('')
    return a < b ? 1 : a > b ? -1 : 0
  })
}

const PlayerProfile = ({ siteLink }) => {
  const [selectedGamePk, setSelectedGamePk] = useState(null)
  const { data, loading } = useQuery(PLAYER_PROFILE, {
    variables: { siteLink },
  })

  if (loading) {
    return <Loader active inline="centered" />
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
    <Container>
      <ActionImg src={profileImgUrl(data.findPlayer.playerId)} />
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
              headers={headers.slice(0, 6)}
              data={player.boxscores}
              handleRowClick={handleRowClick}
            />
          )
        }
      </Media>
      {/* <PlayerMilestones
        playerId={player.playerId}
        gamePks={gamePks.slice(0, 5)}
        selectedGamePk={selectedGamePk}
        setSelectedGamePk={setSelectedGamePk}
        boxscores={player.boxscores}
      /> */}
    </Container>
  )
}

export default PlayerProfile
