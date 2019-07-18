const {
  getBestPlayers,
  sortByPerformance,
  sortByGameDate,
} = require('../../jobs/helpers/get-best-players')
const {
  playerArrayRaw,
  boxscoresForSortByGameDate,
  playerArrayWithStats,
} = require('./get-best-players-helper')

describe('best players are sorted correctly', () => {
  test('1 game', () => {
    const lastNamesInOrder = [
      'Ovechkin',
      'Aho',
      'Kucherov',
      'McDavid',
      'Barkov',
    ]
    const result = getBestPlayers(playerArrayRaw, 1)
    for (const [i, lastName] of lastNamesInOrder.entries()) {
      expect(result[i].lastName).toBe(lastName)
    }
  })

  test('5 games', () => {
    const lastNamesInOrder = [
      'Giroux',
      'Ovechkin',
      'Aho',
      'Kucherov',
      'McDavid',
    ]
    const result = getBestPlayers(playerArrayRaw, 5)
    for (const [i, lastName] of lastNamesInOrder.entries()) {
      expect(result[i].lastName).toBe(lastName)
    }
  })

  test('10 games', () => {
    const lastNamesInOrder = ['Giroux', 'Orpik', 'Ovechkin', 'Aho', 'Kucherov']
    const result = getBestPlayers(playerArrayRaw, 10)
    for (const [i, lastName] of lastNamesInOrder.entries()) {
      expect(result[i].lastName).toBe(lastName)
    }
  })
})

test('sortByGameDate', () => {
  const result = sortByGameDate(boxscoresForSortByGameDate)
  // convert gameDate into a number for testing purposes
  const modifiedResult = result.map(boxscore => ({
    ...boxscore,
    gameDate: parseInt(
      boxscore.gameDate
        .split('T')[0]
        .split('-')
        .join('')
    ),
  }))
  for (let i = 1; i < modifiedResult.length; i++) {
    expect(modifiedResult[i - 1].gameDate).toBeGreaterThan(
      modifiedResult[i].gameDate
    )
  }
})

test('sortByPerformance', () => {
  const lastNamesInOrder = ['Aho', 'McDavid', 'Ovechkin', 'Giroux', 'Kucherov']
  const result = sortByPerformance(playerArrayWithStats)
  for (const [i, lastName] of lastNamesInOrder.entries()) {
    expect(result[i].lastName).toBe(lastName)
  }
})
