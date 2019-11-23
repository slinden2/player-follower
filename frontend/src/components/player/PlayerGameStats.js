import React, { useState, useReducer } from 'react'
import { useQuery } from 'react-apollo-hooks'
import Loader from '../elements/Loader'
import NewStatsTable from '../stats/NewStatsTable'
import breakpoints from '../../styles/breakpoints'
import Rink from './rink/Rink'
import PlayerMilestones from './PlayerMilestones'
import sortReducer from '../../reducers/sortReducer'
import { convertMMSStoSec } from '../../utils'

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

const initialSortState = {
  positionFilter: 'ALL', // not in use
  teamFilter: 'ALL', // not in use
  nationalityFilter: 'ALL', // not in use
  offset: 0,
  sortBy: 'date',
  sortDir: 'DESC',
}

export const PlayerGameStats = ({
  query,
  idArray,
  isGoalie,
  playerId,
  fullName,
}) => {
  const [selectedGamePk, setSelectedGamePk] = useState(null)
  const [sortVars, dispatch] = useReducer(sortReducer, initialSortState)
  const { data, loading } = useQuery(query, {
    variables: {
      idArray,
      isGoalie,
    },
  })

  if (loading) {
    return <Loader />
  }

  const convertStrsToSecs = obj => {
    return {
      ...obj,
      gameDate: new Date(obj.gameDate),
      timeOnIce: convertMMSStoSec(obj.timeOnIce),
      powerPlayTimeOnIce: !isGoalie && convertMMSStoSec(obj.powerPlayTimeOnIce),
      shortHandedTimeOnIce:
        !isGoalie && convertMMSStoSec(obj.shortHandedTimeOnIce),
      decision: isGoalie && obj.decision === 'W' ? 1 : 0,
    }
  }

  const sortGames = games => {
    const sortedGames = games.sort((a, b) => {
      const aNew = convertStrsToSecs(a)
      const bNew = convertStrsToSecs(b)
      let sort
      sortVars.sortDir === 'DESC'
        ? (sort = bNew[sortVars.sortBy] - aNew[sortVars.sortBy])
        : (sort = aNew[sortVars.sortBy] - bNew[sortVars.sortBy])
      return sort
    })
    return sortedGames
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
      <NewStatsTable
        title='Game-by-Game Log'
        headers={headers}
        data={sortGames(statArray)}
        dataType={isGoalie ? 'goalie' : 'skater'}
        sortVars={sortVars}
        sortDispatch={dispatch}
        onRowClick={handleRowClick}
      />

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
