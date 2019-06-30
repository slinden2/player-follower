import React, { createContext, useState, useEffect } from 'react'
import { setCookie, getCookie, removeCookie } from '../utils'

export const AuthContext = createContext()

const AuthContextProvider = props => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const tokenCookie = getCookie('user')
    setToken(tokenCookie)
  }, [])

  console.log('auth user', user)
  console.log('auth token', token)

  const loginUser = token => {
    setToken(token)
    setCookie('user', token)
  }

  const logoutUser = () => {
    setToken(null)
    setUser(null)
    removeCookie('user')
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
