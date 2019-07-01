import React, { createContext, useState, useEffect } from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import { setCookie, getCookie, removeCookie } from '../utils'
import { USER } from '../graphql/queries'

export const AuthContext = createContext()

const AuthContextProvider = props => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    const tokenCookie = getCookie('user')
    setToken(tokenCookie)
  }, [])

  useEffect(() => {
    client
      .query({ query: USER, fetchPolicy: 'network-only' })
      .then(({ data: { me } }) => setUser(me))
  }, [client, token])

  const loginUser = token => {
    setToken(token)
    setCookie('user', token)
  }

  const logoutUser = () => {
    setToken(null)
    setUser(null)
    removeCookie('user')
    client.resetStore()
  }

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, setToken, loginUser, logoutUser }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
