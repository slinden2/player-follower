import React, { useContext } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { useField } from '../hooks'
import { SET_NEW_PASSWORD } from '../graphql/mutations'
import { Form, Button } from 'semantic-ui-react'
import { NotificationContext } from '../contexts/NotificationContext'

const SetNewPassword = ({ history, token, setActivePage }) => {
  const { setNotification } = useContext(NotificationContext)
  const [password, resetPassword] = useField('password', 'password')
  const [confirmPassword, resetConfirmPassword] = useField(
    'confirmpassword',
    'password'
  )
  const setNewPassword = useMutation(SET_NEW_PASSWORD)

  const passwordsMatch = !confirmPassword.value
    ? true
    : password.value === confirmPassword.value

  const handleSetNewPassword = async () => {
    if (!passwordsMatch) {
      setNotification('negative', 'The passwords do not match!')
      resetPassword()
      resetConfirmPassword()
      return
    }

    try {
      await setNewPassword({ variables: { token, password: password.value } })
      setNotification(
        'positive',
        'Your password has been changed. You may now log in with the new password.'
      )
      setActivePage('all')
      history.push('/')
    } catch ({ message }) {
      setNotification('negative', `${message}`)
    }
    resetPassword()
    resetConfirmPassword()
  }

  return (
    <div>
      <Form onSubmit={handleSetNewPassword}>
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
        </Form.Field>
        <Button type="submit" primary={true}>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default SetNewPassword
