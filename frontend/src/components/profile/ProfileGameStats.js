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

  const boxscores = data.boxscores.map(boxscore => {
    const isTeam = context === 'team'

    return {
      ...boxscore,
      teams: !isTeam && (
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
      win: isTeam && boxscore.win ? 'X' : '-',
      loss: isTeam && boxscore.loss ? 'X' : '-',
      ot: isTeam && boxscore.ot ? 'X' : '-',
      otWin: isTeam && boxscore.otWin ? 'X' : '-',
      shootOutWin: isTeam && boxscore.shootOutWin ? 'X' : '-',
      vs: isTeam && boxscore.opponentId.abbreviation,
    }
  })

  const handleRowClick = rowData => {
    setSelectedGamePk([rowData.gamePk])
  }

  const convertStrsToSecs = obj => {
    const isGoalie = context === 'goalie'
    const isTeam = context === 'team'

    return {
      ...obj,
      gameDate: new Date(obj.gameDate),
      timeOnIce: !isTeam && convertMMSStoSec(obj.timeOnIce),
      powerPlayTimeOnIce:
        !isTeam && !isGoalie && convertMMSStoSec(obj.powerPlayTimeOnIce),
      shortHandedTimeOnIce:
        !isTeam && !isGoalie && convertMMSStoSec(obj.shortHandedTimeOnIce),
      decision: isGoalie && obj.decision === 'W' ? 1 : 0,
      win: isTeam && obj.win === 'X' ? 1 : 0,
      loss: isTeam && obj.loss === 'X' ? 1 : 0,
      ot: isTeam && obj.ot === 'X' ? 1 : 0,
      otWin: isTeam && obj.otWin === 'X' ? 1 : 0,
      shootOutWin: isTeam && obj.shootOutWin === 'X' ? 1 : 0,
    }
  }

  const sortGames = games => {
    const sortedGames = games.sort((a, b) => {
      const aNew = convertStrsToSecs(a)
      const bNew = convertStrsToSecs(b)

      let sort
      sortVars.sortDir === 'DESC'
        ? (sort =
            bNew[sortVars.sortBy] - aNew[sortVars.sortBy] ||
            bNew.gameDate - aNew.gameDate)
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
