import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useField } from '../hooks'

const LoginForm = () => {
  const [username, resetUsername] = useField('username', 'text')
  const [password, resetPassword] = useField('password', 'text')

  return (
    <Form>
      <Form.Field>
        <label>Username</label>
        <input placeholder="username" {...username} />
      </Form.Field>
      <Form.Field>
        <label>Password</label>
        <input placeholder="password" {...password} />
      </Form.Field>
      <Button type="submit" primary={true}>
        Log in
      </Button>
    </Form>
  )
}

export default LoginForm
