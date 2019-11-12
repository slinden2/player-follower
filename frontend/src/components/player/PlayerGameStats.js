import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import Media from 'react-media'
import Loader from '../elements/Loader'
import StatsTable from '../stats/StatsTable'
import breakpoints from '../../styles/breakpoints'
import Rink from './rink/Rink'
import PlayerMilestones from './PlayerMilestones'

const skaterHeaders = [
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

const goalieHeaders = [
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
]

export const PlayerGameStats = ({
  query,
  idArray,
  isGoalie,
  playerId,
  fullName,
}) => {
  const [selectedGamePk, setSelectedGamePk] = useState(null)
  const { data, loading } = useQuery(query, {
    variables: {
      idArray,
      isGoalie,
    },
  })

  if (loading) {
    return <Loader />
  }

  const statArray = data.GetGameStats.stats
    .sort((a, b) => b.gamePk - a.gamePk)
    .map(boxscore => ({
      ...boxscore,
      teams:
        boxscore.awayTeam.abbreviation + '@' + boxscore.homeTeam.abbreviation,
    }))
  const gamePks = statArray.map(boxscore => boxscore.gamePk)

  const handleRowClick = rowData => {
    setSelectedGamePk([rowData.gamePk])
  }

  const headers = isGoalie ? goalieHeaders : skaterHeaders

  return (
    <>
      <Media query={breakpoints.showDesktopNavi}>
        {matches =>
          matches ? (
            <StatsTable
              title='Performance Game-by-Game'
              headers={headers}
              data={statArray}
              handleRowClick={handleRowClick}
              isGoalie={isGoalie}
            />
          ) : (
            <StatsTable
              title='Performance Game-by-Game'
              headers={headers.slice(0, 7)}
              data={statArray}
              handleRowClick={handleRowClick}
              isGoalie={isGoalie}
            />
          )
        }
      </Media>
      {!isGoalie && (
        <>
          <Rink data={data.GetGameStats.goals} />
          <PlayerMilestones
            playerId={playerId}
            fullName={fullName}
            gamePks={gamePks.slice(0, 5)}
            selectedGamePk={selectedGamePk}
            setSelectedGamePk={setSelectedGamePk}
            boxscores={statArray}
          />
        </>
      )}
    </>
  )
}
