const {
  reduceStats,
  generatePerGameStats,
} = require('../../jobs/helpers/reduce-stats')
const {
  mockPlayer1GameRaw,
  mockPlayer10GamesRaw,
  mockStats1Game,
  mockStats10Games,
} = require('./reduce-stats-helper')

describe('generatePerGameStats', () => {
  test('1 game', () => {
    const result = generatePerGameStats(mockStats1Game, 1)
    expect(result.timeOnIcePerGame).toBe(1245)
    expect(result.evenTimeOnIcePerGame).toBe(851)
    expect(result.powerPlayTimeOnIcePerGame).toBe(215)
    expect(result.shortHandedTimeOnIcePerGame).toBe(179)
  })

  test('10 games', () => {
    const result = generatePerGameStats(mockStats10Games, 10)
    expect(result.timeOnIcePerGame).toBe(1276)
    expect(result.evenTimeOnIcePerGame).toBe(1143)
    expect(result.powerPlayTimeOnIcePerGame).toBe(29)
    expect(result.shortHandedTimeOnIcePerGame).toBe(103)
  })
})

describe('reduceStats', () => {
  test('1 game', () => {
    const result = reduceStats(mockPlayer1GameRaw, 1)
    expect(result.gamePks.length).toBe(1)
    expect(result.assists).toBe(0)
    expect(result.goals).toBe(0)
    expect(result.shots).toBe(1)
    expect(result.hits).toBe(0)
    expect(result.powerPlayGoals).toBe(0)
    expect(result.powerPlayAssists).toBe(0)
    expect(result.penaltyMinutes).toBe(0)
    expect(result.faceOffWins).toBe(9)
    expect(result.faceoffTaken).toBe(20)
    expect(result.takeaways).toBe(1)
    expect(result.giveaways).toBe(0)
    expect(result.shortHandedGoals).toBe(0)
    expect(result.shortHandedAssists).toBe(0)
    expect(result.blocked).toBe(0)
    expect(result.plusMinus).toBe(0)
    expect(result.evenTimeOnIce).toBe(851)
    expect(result.powerPlayTimeOnIce).toBe(215)
    expect(result.shortHandedTimeOnIce).toBe(179)
    expect(result.points).toBe(0)
    expect(result.gamePk).toBeUndefined()
    expect(result.id).toBeUndefined()
    expect(result.gameDate).toBeUndefined()
    expect(result.decision).toBeUndefined()
  })

  test('10 games', () => {
    const result = reduceStats(mockPlayer10GamesRaw, 10)
    expect(result.gamePks.length).toBe(10)
    expect(result.assists).toBe(1)
    expect(result.goals).toBe(2)
    expect(result.shots).toBe(19)
    expect(result.hits).toBe(18)
    expect(result.powerPlayGoals).toBe(0)
    expect(result.powerPlayAssists).toBe(0)
    expect(result.penaltyMinutes).toBe(4)
    expect(result.faceOffWins).toBe(0)
    expect(result.faceoffTaken).toBe(0)
    expect(result.takeaways).toBe(11)
    expect(result.giveaways).toBe(12)
    expect(result.shortHandedGoals).toBe(0)
    expect(result.shortHandedAssists).toBe(0)
    expect(result.blocked).toBe(9)
    expect(result.plusMinus).toBe(-10)
    expect(result.evenTimeOnIce).toBe(11265)
    expect(result.powerPlayTimeOnIce).toBe(322)
    expect(result.shortHandedTimeOnIce).toBe(1078)
    expect(result.points).toBe(3)
    expect(result.gamePk).toBeUndefined()
    expect(result.id).toBeUndefined()
    expect(result.gameDate).toBeUndefined()
    expect(result.date).toBeUndefined()
    expect(result.decision).toBeUndefined()
  })
})
