import React, { useReducer } from 'react'
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

const ProfileGameStats = ({ data, context, setMilestoneGamePk }) => {
  const [sortVars, dispatch] = useReducer(sortReducer, initialSortState)

  const { headers } = data

  const boxscores = data.boxscores.map(boxscore => {
    const isTeam = context === 'team'

    return {
      ...boxscore,
      teams: !isTeam && (
        <>
          <Link to={`/teams/${boxscore.awayTeam.siteLink}`}>
            {boxscore.awayTeam.abbreviation}
          </Link>
          {'@'}
          <Link to={`/teams/${boxscore.homeTeam.siteLink}`}>
            {boxscore.homeTeam.abbreviation}
          </Link>
        </>
      ),
      win: isTeam && boxscore.win ? 'X' : '-',
      loss: isTeam && boxscore.loss ? 'X' : '-',
      ot: isTeam && boxscore.ot ? 'X' : '-',
      otWin: isTeam && boxscore.otWin ? 'X' : '-',
      shootOutWin: isTeam && boxscore.shootOutWin ? 'X' : '-',
      vs: isTeam && (
        <>
          <Link to={boxscore.opponentId.siteLink}>
            {boxscore.opponentId.abbreviation}
          </Link>
        </>
      ),
    }
  })

  const handleRowClick = rowData => {
    setMilestoneGamePk(rowData.gamePk)
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
      let sortDirA = -1
      let sortDirB = 1

      if (sortVars.sortBy === 'vs') {
        a = { ...a, vs: a.vs.props.children.props.children }
        b = { ...b, vs: b.vs.props.children.props.children }
      } else if (sortVars.sortBy === 'teams') {
        a = { ...a, teams: a.teams.props.children[0].props.children }
        b = { ...b, teams: b.teams.props.children[0].props.children }
      }

      a = convertStrsToSecs(a)
      b = convertStrsToSecs(b)

      const isTextField =
        sortVars.sortBy === 'vs' || sortVars.sortBy === 'teams'

      // Invert sorting for text fields
      if (isTextField) {
        const tmp = sortDirA
        sortDirA = sortDirB
        sortDirB = tmp
      }

      const varA = a[sortVars.sortBy]
      const varB = b[sortVars.sortBy]
      const dateA = a.gameDate.getTime()
      const dateB = b.gameDate.getTime()

      // Sort by defined variable primarily and date as secondary parameter.
      // Secondary date always in descending order
      let sort
      sortVars.sortDir === 'DESC'
        ? (sort =
            varA === varB
              ? dateA > dateB
                ? -1
                : 1
              : varA > varB
              ? sortDirA
              : sortDirB)
        : (sort =
            varA === varB
              ? dateA > dateB
                ? -1
                : 1
              : varA < varB
              ? sortDirA
              : sortDirB)
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
