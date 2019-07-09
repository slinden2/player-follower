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
  mocks,
} = require('./schema-helper')

describe('Schema Unit Tests', () => {
  // array of all test cases
  const testCases = [
    testPlayerCount,
    testFindPlayer,
    testAllPlayers,
    testBestPlayers,
    testFavoritePlayers,
    testFindByName,
    testMe,
  ]

  // make the actual schema executable with mocks
  const schema = makeExecutableSchema({ typeDefs })
  addMockFunctionsToSchema({ schema, mocks })

  for (const testCase of testCases) {
    // eslint-disable-next-line no-unused-vars
    const { id, query, context, variables, expected } = testCase

    test(`query: ${id}`, async () => {
      const result = await graphql(schema, query, null, null, variables)

      expect(result).toEqual(expected)
    })
  }
})
