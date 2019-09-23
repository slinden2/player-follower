import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo-hooks'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import GlobalStyle from './styles/GlobalStyle'
import App from './App'
import { getCookie } from './utils'
import NotificationContextProvider from './contexts/NotificationContext'
import AuthContextProvider from './contexts/AuthContext'
import PlayerContextProvider from './contexts/PlayerContext'
import SearchContextProvider from './contexts/SearchContext'
import ModalContextProvider from './contexts/ModalContext'
import HamburgerContextProvider from './contexts/HamburgerContext'

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

// const cache = new InMemoryCache({
//   dataIdFromObject: object => {
//     switch (object.__typename) {
//       case 'PlayerCard':
//         if (object.numOfGamesId) {
//           return object.numOfGamesId + object.id
//         }
//         return object.id
//       default:
//         return defaultDataIdFromObject(object)
//     }
//   },
// })

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <NotificationContextProvider>
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
    </NotificationContextProvider>
  </ApolloProvider>,
  document.getElementById('root')
)
