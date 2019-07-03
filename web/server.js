const mongoose = require('mongoose')
const { ApolloServer } = require('apollo-server')
const jwt = require('jsonwebtoken')
const config = require('./utils/config')
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')
const User = require('./models/user')

console.log('connecting to', config.MONGODB_URI)

mongoose.set('useFindAndModify', false)

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB: ', error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer')) {
      const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
})

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`server ready at ${url}`)
})
