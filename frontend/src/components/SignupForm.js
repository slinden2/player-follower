import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Form, Button } from 'semantic-ui-react'
import { useField } from '../hooks'
import { CREATE_USER } from '../graphql/mutations'

const SignupForm = () => {
  const [username, resetUsername] = useField('username', 'text')
  const [email, resetEmail] = useField('password', 'text')
  const [password, resetPassword] = useField('password', 'password')

  const createUser = useMutation(CREATE_USER)

  const signup = async () => {
    await createUser({
      variables: {
        username: username.value,
        email: email.value,
        password: password.value,
      },
    })
    resetUsername()
    resetEmail()
    resetPassword()
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
        <Button type="submit" primary={true}>
          Sign Up
        </Button>
      </Form>
    </div>
  )
}

export default SignupForm
