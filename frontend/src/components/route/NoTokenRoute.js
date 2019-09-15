import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const NoTokenRoute = props => {
  const { token } = useContext(AuthContext)

  return !token ? <Route {...props} /> : <Redirect to="/" />
}

export default NoTokenRoute
