import React from 'react'
import { Link, Redirect } from 'react-router-dom'
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
import ProfilePrimaryStats from '../profile/ProfilePrimaryStats'
import {
  statHeaders,
  goalieStatHeaders,
  teamStatHeaders,
  getAge,
  playerBioHeaders,
  formatDateYYYYMMDD,
  convertCmToFeet,
  convertKgToLbs,
} from '../../utils'
import ProfileSecondaryBioMobile, {
  Age,
  BirthDate,
} from '../profile/ProfileSecondaryBioMobile'
import { getFlag } from '../../utils/flags'
import ProfileSecondaryBioDesktop from '../profile/ProfileSecondaryBioDesktop'
import colors from '../../styles/colors'
import ProfileGameStats from '../profile/ProfileGameStats'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${breakpoints.showDesktopNavi} {
    width: 1000px;
    margin: 0 auto;
  }
`

const Flag = styled.img`
  width: 20px;
  margin-left: 5px;
  margin-right: 2px;
  vertical-align: middle;
`

const getCommonPlayerVars = data => {
  const root = data.GetPlayer
  const pob = root.birthStateProvince ? (
    <>
      <Flag src={getFlag(root.birthCountry)} />
      <span>{`${root.birthCity}, ${root.birthStateProvince}, ${root.birthCountry}`}</span>
    </>
  ) : (
    <>
      <Flag src={getFlag(root.birthCountry)} />
      <span>{`${root.birthCity}, ${root.birthCountry}`}</span>
    </>
  )

  // Common between mobile and desktop
  const commonSecondaryData = {
    headers: playerBioHeaders,
    height: convertCmToFeet(root.height),
    weight: (
      <>
        <span>{convertKgToLbs(root.weight)}</span>
        <span style={{ fontSize: '0.875rem' }}>lbs</span>
      </>
    ),
    shoots: root.shootsCatches,
    catches: root.shootsCatches,
    captain: root.captain ? 'C' : root.alternateCaptain ? 'A' : '-',
  }

  return { root, pob, commonSecondaryData }
}

const getPlayerProps = (commonVars, typeSpecificVars) => {
  const { root, pob, commonSecondaryData } = commonVars
  const {
    type,
    headers,
    stats,
    mobileTitleArray,
    desktopTitleArray,
    gameStats,
  } = typeSpecificVars
  return {
    title: 'Player Profile',
    type,
    data: root,
    primaryTitle: root.lastName,
    secondaryTitle: root.firstName,
    primaryInfoString: () => {
      const baseInfoString = `#${root.primaryNumber}, ${root.primaryPosition.abbreviation}`
      return (
        <>
          {baseInfoString}
          <Media query={breakpoints.profileWide}>{pob}</Media>
        </>
      )
    },
    headers,
    stats,
    secondaryBioMobile: {
      ...commonSecondaryData,
      titleArray: mobileTitleArray,
      team: (
        <Link to={`/teams/${root.currentTeam.siteLink}`}>
          {root.currentTeam.name}
        </Link>
      ),
      pob,
      age: (
        <>
          <Age>{getAge(root.birthDate)}</Age>
          <BirthDate>{formatDateYYYYMMDD(root.birthDate)}</BirthDate>
        </>
      ),
    },
    secondaryBioDesktop: {
      ...commonSecondaryData,
      titleArray: desktopTitleArray,
      team: (
        <Link to={`/teams/${root.currentTeam.siteLink}`}>
          <div style={{ fontSize: '0.875rem' }}>
            {root.currentTeam.locationName}
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            {root.currentTeam.teamName}
          </div>
        </Link>
      ),
      age: (
        <>
          <div style={{ textAlign: 'center' }}>{getAge(root.birthDate)}</div>
          <div
            style={{
              textAlign: 'center',
              fontSize: '0.875rem',
              color: colors.grey5,
            }}
          >
            {formatDateYYYYMMDD(root.birthDate)}
          </div>
        </>
      ),
    },
    gameStats,
  }
}

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
      const commonVars = getCommonPlayerVars(data)

      const skaterSpecificVars = {
        type: 'skater',
        headers: statHeaders,
        stats: [
          { id: 'gamesPlayed', value: commonVars.root.stats.gamesPlayed },
          { id: 'goals', value: commonVars.root.stats.goals },
          { id: 'points', value: commonVars.root.stats.points },
        ],
        mobileTitleArray: [
          'team',
          'pob',
          'age',
          ['height', 'weight'],
          ['shoots', 'captain'],
        ],
        desktopTitleArray: [
          'team',
          'age',
          'height',
          'weight',
          'shoots',
          'captain',
        ],
        gameStats: {
          boxscores: commonVars.root.boxscores,
          headers: [
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
          ],
        },
      }

      return getPlayerProps(commonVars, skaterSpecificVars)
    },
    goalie: () => {
      const commonVars = getCommonPlayerVars(data)

      const goalieSpecificVars = {
        type: 'goalie',
        headers: goalieStatHeaders,
        stats: [
          { id: 'gamesPlayed', value: commonVars.root.stats.gamesPlayed },
          {
            id: 'goalsAgainstAverage',
            value: commonVars.root.stats.goalsAgainstAverage,
          },
          { id: 'savePct', value: commonVars.root.stats.savePct },
        ],
        mobileTitleArray: [
          'team',
          'pob',
          'age',
          ['height', 'weight'],
          ['catches', 'captain'],
        ],
        desktopTitleArray: [
          'team',
          'age',
          'height',
          'weight',
          'catches',
          'captain',
        ],
        gameStats: {
          boxscores: commonVars.root.boxscores,
          headers: [
            'gameDate',
            'teams',
            'decision',
            'savePct',
            'saves',
            'goalsAgainst',
            'shotsAgainst',
            'powerPlaySaves',
            'powerPlayShotsAgainst',
            'shortHandedSaves',
            'shortHandedShotsAgainst',
            'penaltyMinutes',
            'timeOnIce',
          ],
        },
      }

      return getPlayerProps(commonVars, goalieSpecificVars)
    },
    team: () => {
      const root = data.GetTeam
      return {
        title: 'Team Profile',
        data: root,
        type: 'team',
        primaryTitle: root.teamName,
        secondaryTitle: root.locationName,
        primaryInfoString: () =>
          `${root.conference.name}, ${root.division.name}`,
        headers: teamStatHeaders,
        stats: [
          { id: 'goalsFor', value: root.stats.goalsFor },
          { id: 'goalsAgainst', value: root.stats.goalsAgainst },
          { id: 'ppPct', value: root.stats.ppPct },
          { id: 'pkPct', value: root.stats.pkPct },
        ],
        gameStats: {
          boxscores: root.linescores,
        },
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
          primaryInfoString={curContext.primaryInfoString}
          headers={curContext.headers}
          stats={curContext.stats}
        />
        <Media query={breakpoints.profileNarrow}>
          <ProfilePrimaryStats
            headers={curContext.headers}
            stats={curContext.stats}
          />
        </Media>
        {context !== 'team' && (
          <Media query={breakpoints.profileNarrow}>
            {matches =>
              matches ? (
                <ProfileSecondaryBioMobile
                  data={curContext.secondaryBioMobile}
                />
              ) : (
                <ProfileSecondaryBioDesktop
                  data={curContext.secondaryBioDesktop}
                />
              )
            }
          </Media>
        )}
        <ProfileGameStats
          data={curContext.gameStats}
          context={curContext.type}
        />
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
