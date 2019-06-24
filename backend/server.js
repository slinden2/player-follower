const mongoose = require('mongoose')
const { ApolloServer } = require('apollo-server')
const jwt = require('jsonwebtoken')
const config = require('./utils/config')
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')
const User = require('./models/user')

require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET

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
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id).populate(
        'favoritePlayers'
      )
      return { currentUser }
    }
  },
})

server.listen().then(({ url }) => {
  console.log(`server ready at ${url}`)
})
