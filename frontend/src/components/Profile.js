import React, { useState } from 'react'
import { useField } from '../hooks'
import { useMutation } from 'react-apollo-hooks'
import { Table, Button, Form } from 'semantic-ui-react'
import { CHANGE_PASSWORD } from '../graphql/mutations'

const Profile = ({ user }) => {
  const [show, setShow] = useState(false)
  const [password, resetPassword] = useField('password', 'password')
  const [confirmPassword, resetConfirmPassword] = useField(
    'confirmpassword',
    'password'
  )

  const changePassword = useMutation(CHANGE_PASSWORD)

  const closeForm = () => {
    resetPassword()
    resetConfirmPassword()
    setShow(false)
  }

  const handlePasswordChange = async () => {
    if (password.value === confirmPassword.value) {
      await changePassword({ variables: { password: password.value } })
      resetPassword()
      resetConfirmPassword()
      setShow(false)
    }
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
