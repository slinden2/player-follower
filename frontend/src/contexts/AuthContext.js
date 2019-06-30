import React, { createContext, useState } from 'react'

export const AuthContext = createContext()

const AuthContextProvider = props => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
