import React, { useState, useContext } from 'react'
import { useField } from '../hooks'
import { useMutation } from 'react-apollo-hooks'
import { Table, Button, Form } from 'semantic-ui-react'
import { CHANGE_PASSWORD } from '../graphql/mutations'
import { NotificationContext } from '../contexts/NotificationContext'
import { AuthContext } from '../contexts/AuthContext'

const Profile = () => {
  const { setNotification } = useContext(NotificationContext)
  const { user } = useContext(AuthContext)
  const [show, setShow] = useState(false)
  const [password, resetPassword] = useField('password', 'password')
  const [confirmPassword, resetConfirmPassword] = useField(
    'confirmpassword',
    'password'
  )

  const changePassword = useMutation(CHANGE_PASSWORD)

  const passwordsMatch = !confirmPassword.value
    ? true
    : password.value === confirmPassword.value

  const closeForm = () => {
    resetPassword()
    resetConfirmPassword()
    setShow(false)
  }

  const handlePasswordChange = async () => {
    if (!passwordsMatch) {
      setNotification('negative', 'The passwords do not match!')
      resetPassword()
      resetConfirmPassword()
      return
    }

    try {
      await changePassword({ variables: { password: password.value } })
      setNotification('positive', 'Your password has been changed.')
      setShow(false)
    } catch ({ message }) {
      setNotification('negative', `${message}`)
    }
    resetPassword()
    resetConfirmPassword()
  }

  return (
    <div>
      <Table definition>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Username</Table.Cell>
            <Table.Cell>{user.username}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Email</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Password</Table.Cell>
            <Table.Cell>
              <Button onClick={() => setShow(true)}>Change password</Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      {show && (
        <Form onSubmit={handlePasswordChange}>
          <Form.Field>
            <label>New password</label>
            <input {...password} />
          </Form.Field>
          <Form.Field>
            <label>Confirm new password</label>
            <input {...confirmPassword} />
            {!passwordsMatch && (
              <span style={{ color: 'red' }}>Passwords do not match!</span>
            )}
          </Form.Field>
          <Button primary type="submit">
            Submit
          </Button>
          <Button onClick={closeForm}>Cancel</Button>
        </Form>
      )}
    </div>
  )
}

export default Profile
