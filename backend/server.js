const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const path = require('path')
const _ = require('lodash')
const config = require('./utils/config')
const typeDefs = require('./graphql/schema')
const resolversProd = require('./graphql/resolvers')
const resolversTest = require('./graphql/resolvers-test')
const User = require('./models/user')

console.log('connecting to the DB')

mongoose.set('useFindAndModify', false)

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB: ', error.message)
  })

// Some resolvers are not allowed in production
const resolvers =
  process.env.NODE_ENV === 'production'
    ? resolversProd
    : _.merge(resolversProd, resolversTest)

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

const app = express()
server.applyMiddleware({ app })

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
  })
}

const port = process.env.PORT || 4000

app.listen({ port }, () =>
  console.log(`server ready at http://localhost:${port}${server.graphqlPath}`)
)
