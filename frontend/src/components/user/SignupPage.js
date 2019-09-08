import React from 'react'
import SignupForm from './SignupForm'
import PageContainer from '../elements/PageContainer'

const SignupPage = ({ history }) => {
  return (
    <PageContainer title="Sign Up">
      <SignupForm history={history} />
    </PageContainer>
  )
}

export default SignupPage
