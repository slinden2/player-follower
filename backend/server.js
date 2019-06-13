const mongoose = require('mongoose')
const { ApolloServer } = require('apollo-server')
const config = require('./utils/config')
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')

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
})

server.listen().then(({ url }) => {
  console.log(`server ready at ${url}`)
})
