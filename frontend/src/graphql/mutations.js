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

const FORGOT_PASSWORD = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email) {
      username
      id
    }
  }
`

const SET_NEW_PASSWORD = gql`
  mutation setNewPassword($token: String!, $password: String!) {
    setNewPassword(token: $token, password: $password) {
      username
      id
    }
  }
`

export {
  CREATE_USER,
  VERIFY_USER,
  CANCEL_USER,
  LOGIN,
  FORGOT_PASSWORD,
  SET_NEW_PASSWORD,
}
