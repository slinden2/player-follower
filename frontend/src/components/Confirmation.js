import React from 'react'
// import { useMutation } from 'react-apollo-hooks'
import { useMutation } from '@apollo/react-hooks'
import { VERIFY_USER, CANCEL_USER } from '../graphql/mutations'
import { Button, Segment, Header } from 'semantic-ui-react'

const Confirmation = ({ history, token, setNotification }) => {
  const [verifyUser] = useMutation(VERIFY_USER, { variables: { token } })
  const [cancelUser] = useMutation(CANCEL_USER, { variables: { token } })

  const handleVerify = async () => {
    try {
      await verifyUser()
      setNotification(
        'positive',
        'Your account has been activated. You may now log in.'
      )
    } catch ({ message }) {
      setNotification('negative', `${message}`)
    }
    history.push('/')
  }

  const handleCancel = async () => {
    try {
      await cancelUser()
      setNotification(
        'warning',
        'Your account has been cancelled and all the information has been deleted from the database.'
      )
    } catch ({ message }) {
      setNotification('negative', `${message}`)
    }
    history.push('/')
  }

  return (
    <Segment>
      <Header>Activate your user account</Header>
      <Button primary={true} onClick={handleVerify}>
        OK
      </Button>
      <Button onClick={handleCancel}>Cancel</Button>
    </Segment>
  )
}

export default Confirmation
