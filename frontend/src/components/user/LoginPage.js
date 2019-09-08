import React from 'react'
import LoginForm from './LoginForm'
import PageContainer from '../elements/PageContainer'

const LoginPage = ({ history }) => {
  return (
    <PageContainer title="Log In">
      <LoginForm history={history} />
    </PageContainer>
  )
}

export default LoginPage
