import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import { VERIFY_USER, CANCEL_USER } from '../graphql/mutations'
import { Button, Segment, Header } from 'semantic-ui-react'

const Confirmation = ({ token }) => {
  const verifyUser = useMutation(VERIFY_USER, { variables: { token } })
  const cancelUser = useMutation(CANCEL_USER, { variables: { token } })

  const handleVerify = async () => {
    await verifyUser()
  }

  const handleCancel = async () => {
    await cancelUser()
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
