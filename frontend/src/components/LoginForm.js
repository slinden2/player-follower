import React from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from 'react-apollo-hooks'
import { Form, Button } from 'semantic-ui-react'
import { useField } from '../hooks'
import { LOGIN } from '../graphql/mutations'

const LoginForm = ({ history }) => {
  const [username, resetUsername] = useField('username', 'text')
  const [password, resetPassword] = useField('password', 'password')

  const login = useMutation(LOGIN)

  const loginUser = async () => {
    await login({
      variables: {
        username: username.value,
        password: password.value,
      },
    })
    resetUsername()
    resetPassword()
    history.push('/')
  }

  return (
    <div>
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
      <Link to="/forgot-password" name="I forgot my password">
        I forgot my password
      </Link>
    </div>
  )
}

export default LoginForm
