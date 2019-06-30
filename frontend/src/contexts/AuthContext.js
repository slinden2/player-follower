import React, { createContext, useState } from 'react'
import { setCookie, removeCookie } from '../utils'

export const AuthContext = createContext()

const AuthContextProvider = props => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

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
