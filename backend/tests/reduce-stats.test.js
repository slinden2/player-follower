const { generatePerGameStats } = require('../utils/reduce-stats')
const { mockStats10Games } = require('./helper')

test('generatePerGameStats', () => {
  const result = generatePerGameStats(mockStats10Games, 10)
  expect(result.timeOnIcePerGame).toBe(1276)
  expect(result.evenTimeOnIcePerGame).toBe(1143)
  expect(result.powerPlayTimeOnIcePerGame).toBe(29)
  expect(result.shortHandedTimeOnIcePerGame).toBe(103)
})
