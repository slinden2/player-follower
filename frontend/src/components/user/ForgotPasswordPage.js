import React from 'react'
import ForgotPassword from './ForgotPassword'
import PageContainer from '../elements/PageContainer'

const ForgotPasswordPage = ({ history }) => {
  return (
    <PageContainer title="Forgot Password">
      <ForgotPassword history={history} />
    </PageContainer>
  )
}

export default ForgotPasswordPage
