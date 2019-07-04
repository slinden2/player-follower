import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from 'react-apollo-hooks'
import { Form, Button } from 'semantic-ui-react'
import { useField } from '../hooks'
import { LOGIN } from '../graphql/mutations'
import { NotificationContext } from '../contexts/NotificationContext'
import { AuthContext } from '../contexts/AuthContext'

const LoginForm = ({ history }) => {
  const { setNotification, handleException } = useContext(NotificationContext)
  const { loginUser } = useContext(AuthContext)
  const [username, resetUsername] = useField('username', 'text')
  const [password, resetPassword] = useField('password', 'password')

  const login = useMutation(LOGIN)

  const handleLogin = async () => {
    try {
      const token = await login({
        variables: {
          username: username.value,
          password: password.value,
        },
      })
      setNotification('positive', `${username.value} successfully logged in.`)
      resetUsername()
      resetPassword()
      loginUser(token.data.login.value)
      history.push('/')
    } catch (exception) {
      handleException(exception)
      resetPassword()
    }
  }

  return (
    <div>
      <Form onSubmit={handleLogin}>
        <Form.Field>
          <label>Username</label>
          <input placeholder="username or email" {...username} />
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
