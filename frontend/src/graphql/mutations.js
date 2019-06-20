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

const CANCEL_USER = gql`
  mutation cancelUser($token: String!) {
    cancelUser(token: $token) {
      username
      id
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

export { CREATE_USER, VERIFY_USER, CANCEL_USER, LOGIN }
