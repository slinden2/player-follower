import { gql } from '@apollo/client'

const USER_DETAILS = gql`
  fragment UserDetails on User {
    id
    username
    email
  }
`

const CREATE_USER = gql`
  mutation createUser(
    $username: String!
    $email: String!
    $password: String!
    $recaptcha: String!
  ) {
    CreateUser(
      username: $username
      email: $email
      password: $password
      recaptcha: $recaptcha
    ) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

const VERIFY_USER = gql`
  mutation verifyUser($token: String!) {
    VerifyUser(token: $token) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

const CANCEL_USER = gql`
  mutation cancelUser($token: String!) {
    CancelUser(token: $token) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    Login(username: $username, password: $password) {
      value
    }
  }
`

const FORGOT_PASSWORD = gql`
  mutation forgotPassword($email: String!) {
    ForgotPassword(email: $email) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

const SET_NEW_PASSWORD = gql`
  mutation setNewPassword($token: String!, $password: String!) {
    SetNewPassword(token: $token, password: $password) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

const CHANGE_PASSWORD = gql`
  mutation changePassword($oldPassword: String!, $newPassword: String!) {
    ChangePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

const FOLLOW_PLAYER = gql`
  mutation followPlayer($id: String!, $followType: FollowType!) {
    FollowPlayer(id: $id, followType: $followType) {
      _id
      fullName
    }
  }
`

const UNFOLLOW_PLAYER = gql`
  mutation unfollowPlayer($id: String!, $followType: FollowType!) {
    FollowPlayer(id: $id, followType: $followType) {
      _id
      fullName
    }
  }
`

const SEND_CONTACT_FORM = gql`
  mutation sendContactForm(
    $name: String!
    $email: String!
    $subject: String!
    $message: String!
    $recaptcha: String!
  ) {
    SendContactForm(
      name: $name
      email: $email
      subject: $subject
      message: $message
      recaptcha: $recaptcha
    )
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
  SEND_CONTACT_FORM,
}
