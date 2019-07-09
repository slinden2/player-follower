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

const testFindByName = {
  id: 'findByName return an array of players',
  query: `
    query findByName($searchString: String!) {
      findByName(searchString: $searchString) {
        id
        fullName
      }
    }
  `,
  variables: { searchString: 'Search String' },
  expected: {
    data: {
      findByName: [
        { fullName: 'Test String', id: 'Test ID String' },
        { fullName: 'Test String', id: 'Test ID String' },
      ],
    },
  },
}

const testMe = {
  id: 'User type returns correct fields',
  query: `
    query {
      me {
        id
        username
        email
        favoritePlayers
      }
    }
  `,
  variables: null,
  expected: {
    data: {
      me: {
        id: 'Test ID String',
        username: 'Test String',
        email: 'Test String',
        favoritePlayers: ['Test String', 'Test String'],
      },
    },
  },
}

const testCreateUser = {
  id: 'createUser consumes username, password and email and returns a user',
  mutation: `
    mutation createUser($username: String!, $password: String!, $email: String!) {
      createUser(username: $username, password: $password, email: $email) {
        id
        username
        email
      }
    }
  `,
  variables: {
    username: 'Test String',
    password: 'Test String',
    email: 'Test String',
  },
  expected: {
    data: {
      createUser: {
        id: 'Test ID String',
        username: 'Test String',
        email: 'Test String',
      },
    },
  },
}

const testVerifyUser = {
  id: 'verifyUser consumes a token and returns a user',
  mutation: `
    mutation verifyUser($token: String!) {
      verifyUser(token: $token) {
        id
        username
        email
      }
    }
  `,
  variables: {
    token: 'Test String',
  },
  expected: {
    data: {
      verifyUser: {
        id: 'Test ID String',
        username: 'Test String',
        email: 'Test String',
      },
    },
  },
}

const testCancelUser = {
  id: 'cancelUser consumes a token and returns a user',
  mutation: `
    mutation cancelUser($token: String!) {
      cancelUser(token: $token) {
        id
        username
        email
      }
    }
  `,
  variables: {
    token: 'Test String',
  },
  expected: {
    data: {
      cancelUser: {
        id: 'Test ID String',
        username: 'Test String',
        email: 'Test String',
      },
    },
  },
}

const testLogin = {
  id: 'Login consumes a username and a password returns a token',
  mutation: `
    mutation login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        value
      }
    }
  `,
  variables: {
    username: 'Test String',
    password: 'Test String',
  },
  expected: {
    data: {
      login: {
        value: 'Test String',
      },
    },
  },
}

const testForgotPassword = {
  id: 'forgotPassword consumes an email and returns a user',
  mutation: `
    mutation forgotPassword($email: String!) {
      forgotPassword(email: $email) {
        id
        username
      }
    }
  `,
  variables: {
    email: 'Test String',
  },
  expected: {
    data: {
      forgotPassword: {
        id: 'Test ID String',
        username: 'Test String',
      },
    },
  },
}

const testSetNewPassword = {
  id: 'setNewPassword consumes a token and a password and returns a user',
  mutation: `
    mutation setNewPassword($token: String!, $password: String!) {
      setNewPassword(token: $token, password: $password) {
        id
        username
      }
    }
  `,
  variables: {
    token: 'Test String',
    password: 'Test String',
  },
  expected: {
    data: {
      setNewPassword: {
        id: 'Test ID String',
        username: 'Test String',
      },
    },
  },
}

const testChangePassword = {
  id: 'changePassword consumes a password and returns a user',
  mutation: `
    mutation changePassword($password: String!) {
      changePassword(password: $password) {
        id
        username
      }
    }
  `,
  variables: {
    password: 'Test String',
  },
  expected: {
    data: {
      changePassword: {
        id: 'Test ID String',
        username: 'Test String',
      },
    },
  },
}

const testFollowPlayer = {
  id: 'followPlayer consumes a password and returns a player',
  mutation: `
    mutation followPlayer($id: String!) {
      followPlayer(id: $id) {
        id
        fullName
      }
    }
  `,
  variables: {
    id: 'Test String',
  },
  expected: {
    data: {
      followPlayer: {
        id: 'Test ID String',
        fullName: 'Test String',
      },
    },
  },
}

const testUnfollowPlayer = {
  id: 'unfollowPlayer consumes a password and returns a player',
  mutation: `
    mutation unfollowPlayer($id: String!) {
      unfollowPlayer(id: $id) {
        id
        fullName
      }
    }
  `,
  variables: {
    id: 'Test String',
  },
  expected: {
    data: {
      unfollowPlayer: {
        id: 'Test ID String',
        fullName: 'Test String',
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
  testFindByName,
  testMe,
  testCreateUser,
  testVerifyUser,
  testCancelUser,
  testLogin,
  testForgotPassword,
  testSetNewPassword,
  testChangePassword,
  testFollowPlayer,
  testUnfollowPlayer,
  mocks,
}
