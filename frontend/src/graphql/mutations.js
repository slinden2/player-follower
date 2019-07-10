import { gql } from 'apollo-boost'

const USER_DETAILS = gql`
  fragment UserDetails on User {
    id
    username
  }
`

const CREATE_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

const VERIFY_USER = gql`
  mutation verifyUser($token: String!) {
    verifyUser(token: $token) {
      ...UserDetails
    }
  }
`

const CANCEL_USER = gql`
  mutation cancelUser($token: String!) {
    cancelUser(token: $token) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
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
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

const SET_NEW_PASSWORD = gql`
  mutation setNewPassword($token: String!, $password: String!) {
    setNewPassword(token: $token, password: $password) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

const CHANGE_PASSWORD = gql`
  mutation changePassword($password: String!) {
    changePassword(password: $password) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

const FOLLOW_PLAYER = gql`
  mutation followPlayer($id: String!, $followType: FollowType!) {
    followPlayer(id: $id, followType: $followType) {
      id
      fullName
    }
  }
`

const UNFOLLOW_PLAYER = gql`
  mutation unfollowPlayer($id: String!, $followType: FollowType!) {
    followPlayer(id: $id, followType: $followType) {
      id
      fullName
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
  CHANGE_PASSWORD,
  FOLLOW_PLAYER,
  UNFOLLOW_PLAYER,
}
