const matchPlayersPipeline = filters => {
  const getPosition = posEnum => {
    const positions = {
      GOALIE: ['G'],
      RIGHT: ['R'],
      CENTER: ['C'],
      LEFT: ['L'],
      DEFENCE: ['D'],
      FORWARD: ['L', 'R', 'C'],
      ALL: ['L', 'R', 'C', 'D'],
    }

    return positions[posEnum]
  }

  const { positionFilter, nationalityFilter, teamFilter, siteLink } = filters

  const handlePositionFilter = () => {
    if (positionFilter === 'ALL') return {}
    return { primaryPosition: { $in: getPosition(positionFilter) } }
  }

  const handleTeamFilter = () => {
    if (teamFilter === 'ALL') return {}
    return { 'team.abbreviation': teamFilter }
  }

  const handleNationalityFilter = () => {
    if (nationalityFilter === 'ALL') return {}
    return { nationality: nationalityFilter }
  }

  // If sitelink is provided, no other filters are needed
  // Every player has a unique siteLink
  if (siteLink) {
    return {
      $match: {
        siteLink,
      },
    }
  }

  return {
    $match: {
      ...handlePositionFilter(),
      ...handleTeamFilter(),
      ...handleNationalityFilter(),
    },
  }
}

module.exports = matchPlayersPipeline
