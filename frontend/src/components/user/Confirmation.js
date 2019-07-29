import React, { useContext } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { VERIFY_USER, CANCEL_USER } from '../../graphql/mutations'
import { Button, Segment, Header } from 'semantic-ui-react'
import { NotificationContext } from '../../contexts/NotificationContext'

const Confirmation = ({ history, token }) => {
  const { setNotification, handleException } = useContext(NotificationContext)
  const verifyUser = useMutation(VERIFY_USER, { variables: { token } })
  const cancelUser = useMutation(CANCEL_USER, { variables: { token } })

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
    } catch (exception) {
      handleException(exception)
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
