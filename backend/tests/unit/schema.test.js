const {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} = require('graphql-tools')
const { graphql } = require('graphql')
const typeDefs = require('../../graphql/schema')
const {
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
} = require('./schema-helper')

describe('Schema Unit Tests', () => {
  // array of all test cases
  const queryTestCases = [
    testPlayerCount,
    testFindPlayer,
    testAllPlayers,
    testBestPlayers,
    testFavoritePlayers,
    testFindByName,
    testMe,
  ]

  const mutationTestCases = [
    testCreateUser,
    testVerifyUser,
    testCancelUser,
    testLogin,
    testForgotPassword,
    testSetNewPassword,
    testChangePassword,
    testFollowPlayer,
    testUnfollowPlayer,
  ]

  // make the actual schema executable with mocks
  const schema = makeExecutableSchema({ typeDefs })
  addMockFunctionsToSchema({ schema, mocks })

  for (const testCase of queryTestCases) {
    const { id, query, variables, expected } = testCase

    test(`query: ${id}`, async () => {
      const result = await graphql(schema, query, null, null, variables)

      expect(result).toEqual(expected)
    })
  }

  for (const testCase of mutationTestCases) {
    const { id, mutation, variables, expected } = testCase

    test(`mutation: ${id}`, async () => {
      const result = await graphql(schema, mutation, null, null, variables)

      expect(result).toEqual(expected)
    })
  }
})
