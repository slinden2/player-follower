import React, { createContext, useState, useContext } from 'react'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import { setCookie, getCookie, removeCookie } from '../utils'
import { USER } from '../graphql/queries'
import { PlayerContext } from './PlayerContext'
import { NotificationContext } from './NotificationContext'

export const AuthContext = createContext()

const AuthContextProvider = props => {
  const [token, setToken] = useState(getCookie('user'))
  const { favoritePlayers } = useContext(PlayerContext)
  const { setNotification } = useContext(NotificationContext)

  const client = useApolloClient()
  const user = useQuery(USER)

  // login user and query favorite players
  const loginUser = async (token, rememberMe) => {
    if (getCookie('funcConsent')) {
      setCookie('user', token, rememberMe)
      setToken(token)
      user.refetch()
      favoritePlayers.refetch()
    }
  }

  const logoutUser = () => {
    setToken(null)
    removeCookie('user')
    client.resetStore()
    setNotification('positive', 'You have been logged out.', 'site')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setToken,
        loginUser,
        logoutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
