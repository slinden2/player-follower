import React, { useContext } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Form, Button } from 'semantic-ui-react'
import { useField } from '../../hooks'
import { FORGOT_PASSWORD } from '../../graphql/mutations'
import { NotificationContext } from '../../contexts/NotificationContext'

const ForgotPassword = ({ history }) => {
  const { setNotification, handleException } = useContext(NotificationContext)
  const [email, resetEmail] = useField('email', 'text')
  const forgotPassword = useMutation(FORGOT_PASSWORD)

  const handleForgotPassword = async () => {
    try {
      await forgotPassword({
        variables: {
          email: email.value,
        },
      })
      setNotification(
        'positive',
        `The password reset link has been set to ${
          email.value
        }. Please click the link to change your password.`
      )
    } catch (exception) {
      handleException(exception)
    }
    resetEmail()
    history.push('/')
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
