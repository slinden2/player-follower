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
  mocks,
} = require('./schema-helper')

describe('Schema Unit Tests', () => {
  // array of all test cases, just 1 for now
  const testCases = [
    testPlayerCount,
    testFindPlayer,
    testAllPlayers,
    testBestPlayers,
    testFavoritePlayers,
  ]
  // make the actual schema and resolvers executable
  const schema = makeExecutableSchema({ typeDefs })
  addMockFunctionsToSchema({ schema, mocks })

  for (const testCase of testCases) {
    const { id, query, context, variables, expected } = testCase

    test(`query: ${id}`, async () => {
      const result = await graphql(schema, query, null, null, variables)

      expect(result).toEqual(expected)
    })
  }
})

// https://medium.com/@nzaghini/properly-test-a-graphql-server-d178241464e7
