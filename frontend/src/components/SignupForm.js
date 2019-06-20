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
  }

  return (
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
  )
}

export default SignupForm

const test = {
  errors: [
    {
      message:
        'Variable "$username" got invalid value { type: "text", name: "username", value: "admin2" }; Expected type String; String cannot represent a non string value: { type: "text", name: "username", value: "admin2" }',
      locations: [{ line: 1, column: 21 }],
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        exception: {
          stacktrace: [
            'TypeError: String cannot represent a non string value: { type: "text", name: "username", value: "admin2" }',
            '    at GraphQLScalarType.coerceString [as parseValue] (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\type\\scalars.js:164:11)',
            '    at coerceValue (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\utilities\\coerceValue.js:55:30)',
            '    at coerceValue (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\utilities\\coerceValue.js:42:12)',
            '    at getVariableValues (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\execution\\values.js:85:54)',
            '    at buildExecutionContext (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\execution\\execute.js:196:63)',
            '    at executeImpl (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\execution\\execute.js:70:20)',
            '    at Object.execute (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\execution\\execute.js:62:35)',
            '    at C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:239:46',
            '    at Generator.next (<anonymous>)',
            '    at C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:7:71',
            '    at new Promise (<anonymous>)',
            '    at __awaiter (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:3:12)',
            '    at execute (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:218:20)',
            '    at Object.<anonymous> (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:156:42)',
            '    at Generator.next (<anonymous>)',
            '    at fulfilled (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:4:58)',
          ],
        },
      },
    },
    {
      message:
        'Variable "$email" got invalid value { type: "text", name: "password", value: "test2@test.com" }; Expected type String; String cannot represent a non string value: { type: "text", name: "password", value: "test2@test.com" }',
      locations: [{ line: 1, column: 41 }],
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        exception: {
          stacktrace: [
            'TypeError: String cannot represent a non string value: { type: "text", name: "password", value: "test2@test.com" }',
            '    at GraphQLScalarType.coerceString [as parseValue] (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\type\\scalars.js:164:11)',
            '    at coerceValue (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\utilities\\coerceValue.js:55:30)',
            '    at coerceValue (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\utilities\\coerceValue.js:42:12)',
            '    at getVariableValues (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\execution\\values.js:85:54)',
            '    at buildExecutionContext (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\execution\\execute.js:196:63)',
            '    at executeImpl (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\execution\\execute.js:70:20)',
            '    at Object.execute (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\execution\\execute.js:62:35)',
            '    at C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:239:46',
            '    at Generator.next (<anonymous>)',
            '    at C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:7:71',
            '    at new Promise (<anonymous>)',
            '    at __awaiter (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:3:12)',
            '    at execute (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:218:20)',
            '    at Object.<anonymous> (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:156:42)',
            '    at Generator.next (<anonymous>)',
            '    at fulfilled (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:4:58)',
          ],
        },
      },
    },
    {
      message:
        'Variable "$password" got invalid value { type: "password", name: "password", value: "salainen" }; Expected type String; String cannot represent a non string value: { type: "password", name: "password", value: "salainen" }',
      locations: [{ line: 1, column: 58 }],
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        exception: {
          stacktrace: [
            'TypeError: String cannot represent a non string value: { type: "password", name: "password", value: "salainen" }',
            '    at GraphQLScalarType.coerceString [as parseValue] (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\type\\scalars.js:164:11)',
            '    at coerceValue (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\utilities\\coerceValue.js:55:30)',
            '    at coerceValue (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\utilities\\coerceValue.js:42:12)',
            '    at getVariableValues (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\execution\\values.js:85:54)',
            '    at buildExecutionContext (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\execution\\execute.js:196:63)',
            '    at executeImpl (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\execution\\execute.js:70:20)',
            '    at Object.execute (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\graphql\\execution\\execute.js:62:35)',
            '    at C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:239:46',
            '    at Generator.next (<anonymous>)',
            '    at C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:7:71',
            '    at new Promise (<anonymous>)',
            '    at __awaiter (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:3:12)',
            '    at execute (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:218:20)',
            '    at Object.<anonymous> (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:156:42)',
            '    at Generator.next (<anonymous>)',
            '    at fulfilled (C:\\Users\\Utente-006\\Documents\\Dev\\JS\\player-follower\\backend\\node_modules\\apollo-server-core\\dist\\requestPipeline.js:4:58)',
          ],
        },
      },
    },
  ],
}
