import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from 'react-apollo-hooks'
import { Form, Button } from 'semantic-ui-react'
import { useField } from '../hooks'
import { LOGIN } from '../graphql/mutations'
import { setCookie } from '../utils'
import { NotificationContext } from '../contexts/NotificationContext'

const LoginForm = ({ history, setActivePage, setToken }) => {
  const { setNotification } = useContext(NotificationContext)
  const [username, resetUsername] = useField('username', 'text')
  const [password, resetPassword] = useField('password', 'password')

  const login = useMutation(LOGIN)

  const loginUser = async () => {
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
      setToken(token.data.login.value)
      setCookie('user', token.data.login.value)
      setActivePage('all')
      history.push('/')
    } catch (exception) {
      setNotification('negative', `${exception.message}`)
      resetPassword()
    }
  }

  return (
    <div>
      <Form onSubmit={loginUser}>
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
