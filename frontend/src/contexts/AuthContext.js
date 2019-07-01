import React, { createContext, useState, useEffect } from 'react'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import { setCookie, getCookie, removeCookie } from '../utils'
import { USER, FAVORITE_PLAYERS } from '../graphql/queries'

export const AuthContext = createContext()

const AuthContextProvider = props => {
  const [token, setToken] = useState(null)

  const client = useApolloClient()
  const user = useQuery(USER)
  const favoritePlayers = useQuery(FAVORITE_PLAYERS)

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
    // setUser(null)
    removeCookie('user')
    client.resetStore()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        // setUser,
        setToken,
        favoritePlayers,
        loginUser,
        logoutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
