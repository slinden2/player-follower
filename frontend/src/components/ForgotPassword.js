import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Form, Button } from 'semantic-ui-react'
import { useField } from '../hooks'
import { FORGOT_PASSWORD } from '../graphql/mutations'

const ForgotPassword = () => {
  const [email, resetEmail] = useField('email', 'text')
  const forgotPassword = useMutation(FORGOT_PASSWORD)

  const handleForgotPassword = async () => {
    const user = await forgotPassword({
      variables: {
        email: email.value,
      },
    })
    resetEmail()
  }

  return (
    <div>
      <Form onSubmit={handleForgotPassword}>
        <Form.Field>
          <label>Email</label>
          <input placeholder="email" {...email} />
        </Form.Field>
        <Button type="submit" primary={true}>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default ForgotPassword
