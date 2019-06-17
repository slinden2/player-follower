import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo-hooks'
import ApolloClient from 'apollo-boost'
import App from './App'
import GlobalStyle from './styles/index'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <GlobalStyle />
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
