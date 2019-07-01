import React, { createContext, useState, useEffect } from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import { setCookie, getCookie, removeCookie } from '../utils'
import { USER, FAVORITE_PLAYERS } from '../graphql/queries'

export const AuthContext = createContext()

const AuthContextProvider = props => {
  const [user, setUser] = useState(null)
  const [favoritePlayers, setFavoritePlayers] = useState(null)
  const [token, setToken] = useState(null)

  console.log(favoritePlayers)

  const client = useApolloClient()

  // login with cookie and query favorite players
  useEffect(() => {
    const tokenCookie = getCookie('user')
    setToken(tokenCookie)
    client
      .query({ query: FAVORITE_PLAYERS })
      .then(players => setFavoritePlayers(players.data.favoritePlayers))
  }, [client])

  // get user from db after login
  useEffect(() => {
    client
      .query({ query: USER, fetchPolicy: 'network-only' })
      .then(({ data: { me } }) => setUser(me))
  }, [client, token])

  // login user and query favorite players
  const loginUser = async token => {
    setToken(token)
    setCookie('user', token)
    const players = await client.query({
      query: FAVORITE_PLAYERS,
      fetchPolicy: 'network-only',
    })
    setFavoritePlayers(players.data.favoritePlayers)
  }

  const logoutUser = () => {
    setToken(null)
    setUser(null)
    setFavoritePlayers(null)
    removeCookie('user')
    client.resetStore()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
        favoritePlayers,
        setFavoritePlayers,
        loginUser,
        logoutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
