import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider, ApolloClient } from '@apollo/client'
import { createHttpLink } from '@apollo/client/link/http'
import { InMemoryCache, defaultDataIdFromObject } from '@apollo/client/cache'
import { setContext } from '@apollo/client/link/context'
import GlobalStyle from './styles/GlobalStyle'
import App from './App'
import { getCookie } from './utils'
import NotificationContextProvider from './contexts/NotificationContext'
import AuthContextProvider from './contexts/AuthContext'
import PlayerContextProvider from './contexts/PlayerContext'
import SearchContextProvider from './contexts/SearchContext'
import ModalContextProvider from './contexts/ModalContext'
import HamburgerContextProvider from './contexts/HamburgerContext'
import NavContextProvider from './contexts/NavContext'

const httpLink = createHttpLink({
  uri: '/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = getCookie('user')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    },
  }
})

const cache = new InMemoryCache({
  dataIdFromObject: object => {
    switch (object.__typename) {
      case 'PlayerCard':
        if (object.numOfGamesId) {
          return object.numOfGamesId + object._id
        }
        return object._id
      case 'CumulativeStats':
        if (object.sortCode) {
          return object.sortCode + object._id
        }
        return object._id
      case 'TeamCard':
        if (object.numOfGamesId) {
          return object.numOfGamesId + object._id
        }
        return object._id
      default:
        return defaultDataIdFromObject(object)
    }
  },
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <NotificationContextProvider>
      <NavContextProvider>
        <ModalContextProvider>
          <HamburgerContextProvider>
            <PlayerContextProvider>
              <AuthContextProvider>
                <SearchContextProvider>
                  <GlobalStyle />
                  <App />
                </SearchContextProvider>
              </AuthContextProvider>
            </PlayerContextProvider>
          </HamburgerContextProvider>
        </ModalContextProvider>
      </NavContextProvider>
    </NotificationContextProvider>
  </ApolloProvider>,
  document.getElementById('root')
)
