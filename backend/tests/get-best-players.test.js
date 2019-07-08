const {
  getBestPlayers,
  sortByPerformance,
  sortByGameDate,
} = require('../utils/get-best-players')
const {
  playerArrayRaw,
  boxscoresForSortByGameDate,
  playerArrayWithStats,
} = require('./get-best-players-helper')

describe('players are sorted correctly', () => {
  test('1 game', () => {
    const lastNamesInOrder = [
      'McDavid',
      'Barkov',
      'Kucherov',
      'Ovechkin',
      'Aho',
    ]
    const result = getBestPlayers(playerArrayRaw, 1)
    for (const [i, lastName] of lastNamesInOrder.entries()) {
      expect(result[i].lastName).toBe(lastName)
    }
  })

  test('5 games', () => {
    const lastNamesInOrder = ['McDavid', 'Aho', 'Ovechkin', 'Barkov', 'Giroux']
    const result = getBestPlayers(playerArrayRaw, 5)
    for (const [i, lastName] of lastNamesInOrder.entries()) {
      expect(result[i].lastName).toBe(lastName)
    }
  })

  test('10 games', () => {
    const lastNamesInOrder = [
      'McDavid',
      'Aho',
      'Ovechkin',
      'Giroux',
      'Kucherov',
    ]
    const result = getBestPlayers(playerArrayRaw, 10)
    for (const [i, lastName] of lastNamesInOrder.entries()) {
      expect(result[i].lastName).toBe(lastName)
    }
  })
})

test('sortByGameDate', () => {
  const result = sortByGameDate(boxscoresForSortByGameDate)
  for (let i = 1; i < result.length; i++) {
    expect(result[i - 1].gameDate).toBeGreaterThan(result[i].gameDate)
  }
})

test('sortByPerformance', () => {
  const lastNamesInOrder = ['Aho', 'McDavid', 'Ovechkin', 'Giroux', 'Kucherov']
  const result = sortByPerformance(playerArrayWithStats)
  for (const [i, lastName] of lastNamesInOrder.entries()) {
    expect(result[i].lastName).toBe(lastName)
  }
})
