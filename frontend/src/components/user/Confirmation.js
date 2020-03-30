import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { VERIFY_USER } from '../../graphql/mutations'
import PageContainer from '../elements/PageContainer'
import ContentWrapper from '../elements/ContentWrapper'
import Loader from '../elements/Loader'
import { TextRow } from '../../styles/forms'
import colors from '../../styles/colors'

const Confirmation = ({ token }) => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const verifyUser = useMutation(VERIFY_USER, { variables: { token } })

  const canFetch = !user && !error

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newUser = await verifyUser()
        setUser(newUser.data.VerifyUser)
      } catch ({ message }) {
        setError(message)
      }
    }

    if (canFetch) fetchData()
  }, [verifyUser, canFetch])

  if (canFetch) {
    return <Loader offset />
  }

  return (
    <PageContainer title='Account Confirmation'>
      <ContentWrapper>
        {error && (
          <TextRow color={colors.red1} data-cy='confirmation-error'>
            The token is either invalid or already expired. Please check that
            the address in the address bar corresponds to the link sent to you
            via email. If not, please try again with a correct token.
          </TextRow>
        )}

        {user && (
          <TextRow data-cy='confirmation-success'>
            The account for {user.username} ({user.email}) has been successfully
            created. You may now log in and start using the site at its full
            potential.
          </TextRow>
        )}
      </ContentWrapper>
    </PageContainer>
  )
}

export default Confirmation
