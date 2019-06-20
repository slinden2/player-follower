import { gql } from 'apollo-boost'

const CREATE_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      username
      id
    }
  }
`

const VERIFY_USER = gql`
  mutation verifyUser($token: String!) {
    verifyUser(token: $token) {
      username
    }
  }
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export { CREATE_USER, VERIFY_USER, LOGIN }
