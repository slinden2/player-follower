import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const ProtectedRoute = props => {
  const { token } = useContext(AuthContext)

  return token ? <Route {...props} /> : <Redirect to="/login" />
}

export default ProtectedRoute
