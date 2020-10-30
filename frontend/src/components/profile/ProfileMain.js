import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Media from 'react-media'
import styled from 'styled-components'
import { useQuery } from '@apollo/client'
import { PLAYER_MILESTONES, GET_GAME_RECAPS } from '../../graphql/queries'
import PageContainer from '../elements/PageContainer'
import breakpoints from '../../styles/breakpoints'
import Loader from '../elements/Loader'
import ProfileHeader from './ProfileHeader'
import ProfilePrimaryStats from './ProfilePrimaryStats'
import {
  statHeaders,
  playerProfileStatHeaders,
  goalieStatHeaders,
  teamStatHeaders,
  getAge,
  playerBioHeaders,
  formatDateYYYYMMDD,
  convertCmToFeet,
  convertKgToLbs,
  goalieProfileStatHeaders,
  teamProfileStatHeaders,
} from '../../utils'
import ProfileSecondaryBioMobile, {
  Age,
  BirthDate,
} from './ProfileSecondaryBioMobile'
import { getFlag } from '../../utils/flags'
import ProfileSecondaryBioDesktop from './ProfileSecondaryBioDesktop'
import colors from '../../styles/colors'
import ProfileGameStats from './ProfileGameStats'
import ProfilePlayerMilestones from '../milestone/ProfilePlayerMilestones'
import ProfileTeamMilestones from '../milestone/ProfileTeamMilestones'

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

const NoGamesDiv = styled.div`
  margin: 2rem 0;
`

const getLatestGamePk = (boxscores, ignoreGoals) => {
  const latestBoxscore = boxscores.reduce((acc, cur) => {
    let cond
    ignoreGoals
      ? (cond = acc.gamePk < cur.gamePk)
      : (cond = acc.gamePk < cur.gamePk && cur.goals > 0)

    if (cond) return cur
    else return acc
  }, 0)

  return latestBoxscore.gamePk
}

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
    milestones,
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
          <span>{baseInfoString}</span>
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
    milestones,
  }
}

const ProfileMain = ({ siteLink, context, query }) => {
  const [milestoneGamePk, setMilestoneGamePk] = useState(null)

  const test = useQuery(query, {
    variables: { siteLink, type: context },
  })

  if (test.loading) {
    return <Loader offset />
  }

  if (!test.data.GetPlayer && !test.data.GetTeam) {
    return <Redirect to='/404' />
  }

  const hasPlayedGames =
    !!test.data.GetPlayer?.boxscores?.length ||
    !!test.data.GetTeam?.linescores?.length

  const contextSelector = {
    skater: () => {
      const commonVars = getCommonPlayerVars(test.data)

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
          stats: commonVars.root.stats,
          headers: playerProfileStatHeaders,
          statHeaders: ['total', ...playerProfileStatHeaders.slice(2)],
        },
        milestones: {
          query: PLAYER_MILESTONES,
          variables: {
            playerId: commonVars.root._id,
            gamePks:
              milestoneGamePk || getLatestGamePk(commonVars.root.boxscores),
          },
        },
      }

      return getPlayerProps(commonVars, skaterSpecificVars)
    },
    goalie: () => {
      const commonVars = getCommonPlayerVars(test.data)

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
          headers: goalieProfileStatHeaders,
          stats: commonVars.root.stats,
          statHeaders: ['total', ...goalieProfileStatHeaders.slice(2)],
        },
      }

      return getPlayerProps(commonVars, goalieSpecificVars)
    },
    team: () => {
      const root = test.data.GetTeam
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
          headers: teamProfileStatHeaders,
          boxscores: root.linescores,
          stats: { ...root.stats },
          statHeaders: [
            'total',
            'wins',
            'losses',
            'otLosses',
            'otWins',
            'shootOutWins',
            ...teamProfileStatHeaders.slice(7),
          ],
        },
        milestones: {
          query: GET_GAME_RECAPS,
          variables: {
            teamId: root._id,
            gamePk: milestoneGamePk || getLatestGamePk(root.linescores, true),
          },
        },
      }
    },
  }

  const curContext = contextSelector[context]()

  console.log(curContext)

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
        {hasPlayedGames ? (
          <>
            <ProfileGameStats
              data={curContext.gameStats}
              context={curContext.type}
              setMilestoneGamePk={setMilestoneGamePk}
            />
            {context === 'skater' && (
              <ProfilePlayerMilestones
                query={curContext.milestones.query}
                variables={curContext.milestones.variables}
              />
            )}
            {context === 'team' && (
              <ProfileTeamMilestones
                query={curContext.milestones.query}
                variables={curContext.milestones.variables}
              />
            )}
          </>
        ) : (
          <NoGamesDiv>
            The {context} has no played games in the selected season.
          </NoGamesDiv>
        )}
      </Container>
    </PageContainer>
  )
}

export default ProfileMain
