import React from 'react'
import { Redirect } from 'react-router-dom'
import Media from 'react-media'
import styled from 'styled-components'
import { useQuery } from 'react-apollo-hooks'
import {
  SKATER_PROFILE,
  GOALIE_PROFILE,
  GET_SKATER_STATS,
  GET_GOALIE_STATS,
  TEAM_PROFILE,
} from '../../graphql/queries'
import PlayerBioTable from './PlayerBioTable'
import PageContainer from '../elements/PageContainer'
import breakpoints from '../../styles/breakpoints'
import Loader from '../elements/Loader'
import { PlayerGameStats } from './PlayerGameStats'
import ProfileHeader from '../profile/ProfileHeader'
import { MainStats } from '../profile/MainStats'
import { statHeaders, goalieStatHeaders, teamStatHeaders } from '../../utils'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${breakpoints.showDesktopNavi} {
    width: 1000px;
    margin: 0 auto;
  }
`

const PlayerProfile = ({ siteLink, context }) => {
  const querySelector = {
    skater: SKATER_PROFILE,
    goalie: GOALIE_PROFILE,
    team: TEAM_PROFILE,
  }

  const query = querySelector[context]

  const { data, loading } = useQuery(query, {
    variables: { siteLink, type: context },
  })

  if (loading) {
    return <Loader offset />
  }

  if (!data.GetPlayer && !data.GetTeam) {
    return <Redirect to='/404' />
  }

  const contextSelector = {
    skater: () => {
      const root = data.GetPlayer
      return {
        title: root.fullName,
        type: 'skater',
        data: root,
        primaryTitle: root.lastName,
        secondaryTitle: root.firstName,
        additionalInfo1: `#${root.primaryNumber}, ${root.primaryPosition.abbreviation}`,
        headers: statHeaders,
        stats: [
          { id: 'gamesPlayed', value: root.stats.gamesPlayed },
          { id: 'goals', value: root.stats.goals },
          { id: 'points', value: root.stats.points },
        ],
      }
    },
    goalie: () => {
      const root = data.GetPlayer
      return {
        title: root.fullName,
        type: 'goalie',
        data: root,
        primaryTitle: root.lastName,
        secondaryTitle: root.firstName,
        additionalInfo1: `#${root.primaryNumber}, ${root.primaryPosition.abbreviation}`,
        headers: goalieStatHeaders,
        stats: [
          { id: 'gamesPlayed', value: root.stats.gamesPlayed },
          { id: 'goalsAgainstAverage', value: root.stats.goalsAgainstAverage },
          { id: 'savePct', value: root.stats.savePct },
        ],
      }
    },
    team: () => {
      const root = data.GetTeam
      return {
        title: root.name,
        data: root,
        type: 'team',
        primaryTitle: root.teamName,
        secondaryTitle: root.locationName,
        additionalInfo1: `${root.conference.name}, ${root.division.name}`,
        headers: teamStatHeaders,
        stats: [
          { id: 'goalsFor', value: root.stats.goalsFor },
          { id: 'goalsAgainst', value: root.stats.goalsAgainst },
          { id: 'ppPct', value: root.stats.ppPct },
          { id: 'pkPct', value: root.stats.pkPct },
        ],
      }
    },
  }

  const curContext = contextSelector[context]()

  return (
    <PageContainer title={curContext.title}>
      <Container>
        <ProfileHeader
          primaryTitle={curContext.primaryTitle}
          secondaryTitle={curContext.secondaryTitle}
          additionalInfo1={curContext.additionalInfo1}
          headers={curContext.headers}
          stats={curContext.stats}
        />
        <Media query={breakpoints.profileNarrow}>
          <MainStats headers={curContext.headers} stats={curContext.stats} />
        </Media>
        {/* <PlayerBioTable player={curContext.data} /> */}
        {/* <PlayerGameStats
          query={isGoalie ? GET_GOALIE_STATS : GET_SKATER_STATS}
          idArray={player.boxscores}
          isGoalie={isGoalie}
          playerId={player.id}
          fullName={player.fullName}
        /> */}
      </Container>
    </PageContainer>
  )
}

export default PlayerProfile
