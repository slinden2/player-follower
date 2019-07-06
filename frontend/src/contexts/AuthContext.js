import React, { createContext, useState, useEffect, useContext } from 'react'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import { setCookie, getCookie, removeCookie } from '../utils'
import { USER } from '../graphql/queries'
import { PlayerContext } from './PlayerContext'

export const AuthContext = createContext()

const AuthContextProvider = props => {
  const [token, setToken] = useState(null)
  const { favoritePlayers } = useContext(PlayerContext)

  const client = useApolloClient()
  const user = useQuery(USER)

  // login with cookie
  useEffect(() => {
    const tokenCookie = getCookie('user')
    setToken(tokenCookie)
  }, [])

  // login user and query favorite players
  const loginUser = async token => {
    setToken(token)
    setCookie('user', token)
    user.refetch()
    favoritePlayers.refetch()
  }

  const logoutUser = () => {
    setToken(null)
    removeCookie('user')
    client.resetStore()
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
