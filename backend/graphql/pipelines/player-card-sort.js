const playerCardSort = sortBy => {
  const sortArg =
    sortBy === 'points'
      ? { [`stats.${sortBy}`]: -1 }
      : { [`stats.${sortBy}`]: -1, 'stats.points': -1 }

  return [
    {
      $sort: {
        ...sortArg,
        'stats.goals': -1,
        'stats.plusMinus': -1,
        'player.lastName': 1,
      },
    },
    { $limit: 50 },
  ]
}

module.exports = playerCardSort
