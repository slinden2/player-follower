import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Form, Button } from 'semantic-ui-react'
import { useField } from '../hooks'
import { LOGIN } from '../graphql/mutations'

const LoginForm = () => {
  const [username, resetUsername] = useField('username', 'text')
  const [password, resetPassword] = useField('password', 'password')

  const login = useMutation(LOGIN)

  const loginUser = async () => {
    const token = await login({
      variables: {
        username: username.value,
        password: password.value,
      },
    })
    resetUsername()
    resetPassword()
    console.log(token)
  }

  return (
    <Form onSubmit={loginUser}>
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
