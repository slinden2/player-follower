import React, { useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import NewStatsTable from '../stats/NewStatsTable'
import sortReducer from '../../reducers/sortReducer'
import { convertMMSStoSec } from '../../utils'

const initialSortState = {
  positionFilter: 'ALL', // not in use
  teamFilter: 'ALL', // not in use
  nationalityFilter: 'ALL', // not in use
  offset: 0,
  sortBy: 'gameDate',
  sortDir: 'DESC',
}

const ProfileGameStats = ({ data, context }) => {
  const [selectedGamePk, setSelectedGamePk] = useState(null)
  const [sortVars, dispatch] = useReducer(sortReducer, initialSortState)

  const { headers } = data

  const boxscores = data.boxscores.map(boxscore => ({
    ...boxscore,
    teams: (
      <>
        <Link to={boxscore.awayTeam.siteLink}>
          {boxscore.awayTeam.abbreviation}
        </Link>
        {'@'}
        <Link to={boxscore.homeTeam.siteLink}>
          {boxscore.homeTeam.abbreviation}
        </Link>
      </>
    ),
  }))

  const handleRowClick = rowData => {
    setSelectedGamePk([rowData.gamePk])
  }

  const convertStrsToSecs = obj => {
    const isGoalie = context === 'goalie'

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

  return (
    <NewStatsTable
      title='Game-by-Game Log'
      headers={headers}
      data={sortGames(boxscores)}
      dataType={context}
      sortVars={sortVars}
      sortDispatch={dispatch}
      onRowClick={handleRowClick}
    />
  )
}

export default ProfileGameStats
