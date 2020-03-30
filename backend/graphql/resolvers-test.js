const Token = require('../models/token')
const resetDb = require('../tests/scripts/reset-db')
const seedDb = require('../tests/scripts/seed-db')

const resolvers = {
  Query: {
    GetToken: async () => {
      const token = await Token.findOne({})
      return token
    },
  },
  Mutation: {
    ResetDB: async () => {
      await resetDb()
      return true
    },
    SeedDB: async () => {
      await seedDb()
      return true
    },
  },
}

module.exports = resolvers
