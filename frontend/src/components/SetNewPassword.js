import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import { useField } from '../hooks'
import { SET_NEW_PASSWORD } from '../graphql/mutations'
import { Form, Button } from 'semantic-ui-react'

const SetNewPassword = ({ history, token, setActivePage, setNotification }) => {
  const [password, resetPassword] = useField('password', 'password')
  const [confirmPassword, resetConfirmPassword] = useField(
    'confirmpassword',
    'password'
  )
  const setNewPassword = useMutation(SET_NEW_PASSWORD)

  const handleSetNewPassword = async () => {
    if (password.value === confirmPassword.value) {
      await setNewPassword({ variables: { token, password: password.value } })
      setNotification(
        'positive',
        'Your password has been changed. You may now log in with the new password.'
      )
      resetPassword()
      resetConfirmPassword()
      setActivePage('all')
      history.push('/')
    }
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
        </Form.Field>
        <Button type="submit" primary={true}>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default SetNewPassword
