import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import { VERIFY_USER } from '../graphql/mutations'
import { Button, Segment, Header } from 'semantic-ui-react'

const Confirmation = ({ token }) => {
  const verifyUser = useMutation(VERIFY_USER, { variables: { token } })

  const handleVerify = async () => {
    await verifyUser()
  }

  return (
    <Segment>
      <Header>Activate your user account</Header>
      <Button primary={true} onClick={handleVerify}>
        OK
      </Button>
    </Segment>
  )
}

export default Confirmation
