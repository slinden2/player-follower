const createTeamStats = (teamInDb, stats) => {
  const teamStats = {
    ...stats,
    faceOffWinPct: stats.faceoffWinPctg,
    ppPct: stats.ppPctg,
    pkPct: stats.pkPctg || 0,
    pointPct: stats.pointPctg,
  }
  teamStats.date = new Date().toISOString().split('T')[0]
  teamStats.createdAt = new Date().toISOString().split('T')[0]
  teamStats.team = teamInDb._id
  delete teamStats.abbrev
  delete teamStats.teamFullName
  delete teamStats.teamId

  return teamStats
}

module.exports = createTeamStats
