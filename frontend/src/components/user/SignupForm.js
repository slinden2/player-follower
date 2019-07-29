import React, { useContext } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Form, Button } from 'semantic-ui-react'
import { useField } from '../../hooks'
import { CREATE_USER } from '../../graphql/mutations'
import { NotificationContext } from '../../contexts/NotificationContext'

const SignupForm = ({ history }) => {
  const { setNotification, handleException } = useContext(NotificationContext)
  const [username, resetUsername] = useField('username', 'text')
  const [email, resetEmail] = useField('password', 'text')
  const [password, resetPassword] = useField('password', 'password')
  const [confirmPassword, resetConfirmPassword] = useField(
    'confirmpassword',
    'password'
  )

  const createUser = useMutation(CREATE_USER)

  const passwordsMatch = !confirmPassword.value
    ? true
    : password.value === confirmPassword.value

  const signup = async () => {
    if (!passwordsMatch) {
      setNotification('negative', 'The passwords do not match!')
      resetPassword()
      resetConfirmPassword()
      return
    }

    try {
      await createUser({
        variables: {
          username: username.value,
          email: email.value,
          password: password.value,
        },
      })
    } catch (exception) {
      handleException(exception)
      return
    }

    setNotification(
      'positive',
      `An account for ${
        username.value
      } has been created. Before logging in, you must activate your account by clicking the activation link sent to ${
        email.value
      }.`
    )
    resetUsername()
    resetEmail()
    resetPassword()
    resetConfirmPassword()
    history.push('/')
  }

  return (
    <div>
      <Form onSubmit={signup}>
        <Form.Field>
          <label>Username</label>
          <input placeholder="username" {...username} />
        </Form.Field>
        <Form.Field>
          <label>Email</label>
          <input placeholder="email" {...email} />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input placeholder="password" {...password} />
        </Form.Field>
        <Form.Field>
          <label>Confirm password</label>
          <input placeholder="password" {...confirmPassword} />
          {!passwordsMatch && (
            <span style={{ color: 'red' }}>Passwords do not match!</span>
          )}

          <span />
        </Form.Field>
        <Button type="submit" primary={true}>
          Sign Up
        </Button>
      </Form>
    </div>
  )
}

export default SignupForm
