const testPlayerCount = {
  id: 'Player count return correct type',
  query: `
    query {
      playerCount
    }
  `,
  variables: null,
  expected: {
    data: {
      playerCount: 10,
    },
  },
}

const testFindPlayer = {
  id: 'Fields of player and stat types return correct types',
  query: `
    query findPlayer($playerId: Int!) {
      findPlayer(playerId: $playerId) {
        link
        firstName
        lastName
        fullName
        primaryNumber
        birthDate
        birthCity
        birthStateProvince
        birthCountry
        nationality
        height
        weight
        active
        alternateCaptain
        captain
        rookie
        shootsCatches
        rosterStatus
        currentTeam
        primaryPosition
        playerId
        boxscores {
          gamePk
          date
          numOfGames
          timeOnIce
          assists
          goals
          points
          shots
          shotPct
          hits
          powerPlayGoals
          powerPlayAssists
          penaltyMinutes
          faceOffWins
          faceoffTaken
          faceOffPct
          takeaways
          giveaways
          shortHandedGoals
          shortHandedAssists
          blocked
          plusMinus
          evenTimeOnIce
          powerPlayTimeOnIce
          shortHandedTimeOnIce
          saves
          savePct
          powerPlaySaves
          shortHandedSaves
          evenSaves
          shortHandedShotsAgainst
          evenShotsAgainst
          powerPlayShotsAgainst
          decision
          id
          savePctTotal
        }
        stats {
          gamePks
          timeOnIcePerGame
          evenTimeOnIcePerGame
          powerPlayTimeOnIcePerGame
          shortHandedTimeOnIcePerGame
        }
        id
        numOfGamesId
      }
    }
  `,
  variables: { playerId: 1 },
  expected: {
    data: {
      findPlayer: {
        link: 'Test String',
        firstName: 'Test String',
        lastName: 'Test String',
        fullName: 'Test String',
        primaryNumber: 10,
        birthDate: 'Test String',
        birthCity: 'Test String',
        birthStateProvince: 'Test String',
        birthCountry: 'Test String',
        nationality: 'Test String',
        height: 10,
        weight: 10,
        active: true,
        alternateCaptain: true,
        captain: true,
        rookie: true,
        shootsCatches: 'Test String',
        rosterStatus: 'Test String',
        currentTeam: 10,
        primaryPosition: 'Test String',
        playerId: 10,
        numOfGamesId: 10,
        boxscores: [
          {
            assists: 10,
            blocked: 10,
            date: 10,
            decision: 'Test String',
            evenSaves: 10,
            evenShotsAgainst: 10,
            evenTimeOnIce: 10,
            faceOffPct: 10.5,
            faceOffWins: 10,
            faceoffTaken: 10,
            gamePk: 10,
            giveaways: 10,
            goals: 10,
            hits: 10,
            id: 'Test ID String',
            numOfGames: 10,
            penaltyMinutes: 10,
            plusMinus: 10,
            points: 10,
            powerPlayAssists: 10,
            powerPlayGoals: 10,
            powerPlaySaves: 10,
            powerPlayShotsAgainst: 10,
            powerPlayTimeOnIce: 10,
            savePct: 10.5,
            savePctTotal: 10.5,
            saves: 10,
            shotPct: 10.5,
            shots: 10,
            shortHandedAssists: 10,
            shortHandedGoals: 10,
            shortHandedSaves: 10,
            shortHandedShotsAgainst: 10,
            shortHandedTimeOnIce: 10,
            takeaways: 10,
            timeOnIce: 10,
          },
          {
            assists: 10,
            blocked: 10,
            date: 10,
            decision: 'Test String',
            evenSaves: 10,
            evenShotsAgainst: 10,
            evenTimeOnIce: 10,
            faceOffPct: 10.5,
            faceOffWins: 10,
            faceoffTaken: 10,
            gamePk: 10,
            giveaways: 10,
            goals: 10,
            hits: 10,
            id: 'Test ID String',
            numOfGames: 10,
            penaltyMinutes: 10,
            plusMinus: 10,
            points: 10,
            powerPlayAssists: 10,
            powerPlayGoals: 10,
            powerPlaySaves: 10,
            powerPlayShotsAgainst: 10,
            powerPlayTimeOnIce: 10,
            savePct: 10.5,
            savePctTotal: 10.5,
            saves: 10,
            shotPct: 10.5,
            shots: 10,
            shortHandedAssists: 10,
            shortHandedGoals: 10,
            shortHandedSaves: 10,
            shortHandedShotsAgainst: 10,
            shortHandedTimeOnIce: 10,
            takeaways: 10,
            timeOnIce: 10,
          },
        ],
        stats: {
          gamePks: [10, 10],
          timeOnIcePerGame: 10,
          evenTimeOnIcePerGame: 10,
          powerPlayTimeOnIcePerGame: 10,
          shortHandedTimeOnIcePerGame: 10,
        },
        id: 'Test ID String',
      },
    },
  },
}

const testAllPlayers = {
  id: 'All players return player types in an array',
  query: `
    query {
      allPlayers {
        fullName
        id
      }
    }
  `,
  variables: null,
  expected: {
    data: {
      allPlayers: [
        { fullName: 'Test String', id: 'Test ID String' },
        { fullName: 'Test String', id: 'Test ID String' },
      ],
    },
  },
}

const testBestPlayers = {
  id: 'Best players return periodStats',
  query: `
    query {
      bestPlayers {
        oneGame {
          id
          fullName
        }
        fiveGames {
          id
          fullName
        }
        tenGames {
          id
          fullName
        }
      }
    }
  `,
  variables: null,
  expected: {
    data: {
      bestPlayers: {
        oneGame: [
          {
            id: 'Test ID String',
            fullName: 'Test String',
          },
          {
            id: 'Test ID String',
            fullName: 'Test String',
          },
        ],
        fiveGames: [
          {
            id: 'Test ID String',
            fullName: 'Test String',
          },
          {
            id: 'Test ID String',
            fullName: 'Test String',
          },
        ],
        tenGames: [
          {
            id: 'Test ID String',
            fullName: 'Test String',
          },
          {
            id: 'Test ID String',
            fullName: 'Test String',
          },
        ],
      },
    },
  },
}

const testFavoritePlayers = {
  id: 'Favorite players return periodStats',
  query: `
    query {
      favoritePlayers {
        oneGame {
          id
          fullName
        }
        fiveGames {
          id
          fullName
        }
        tenGames {
          id
          fullName
        }
      }
    }
  `,
  variables: null,
  expected: {
    data: {
      favoritePlayers: {
        oneGame: [
          {
            id: 'Test ID String',
            fullName: 'Test String',
          },
          {
            id: 'Test ID String',
            fullName: 'Test String',
          },
        ],
        fiveGames: [
          {
            id: 'Test ID String',
            fullName: 'Test String',
          },
          {
            id: 'Test ID String',
            fullName: 'Test String',
          },
        ],
        tenGames: [
          {
            id: 'Test ID String',
            fullName: 'Test String',
          },
          {
            id: 'Test ID String',
            fullName: 'Test String',
          },
        ],
      },
    },
  },
}

const mocks = {
  Int: () => 10,
  Float: () => 10.5,
  String: () => 'Test String',
  Boolean: () => true,
  ID: () => 'Test ID String',
}

module.exports = {
  testPlayerCount,
  testFindPlayer,
  testAllPlayers,
  testBestPlayers,
  testFavoritePlayers,
  mocks,
}
