import React, { useState, useContext } from 'react'
import styled, { css } from 'styled-components'
import { AuthContext } from '../../contexts/AuthContext'
import PageContainer from '../elements/PageContainer'
import ContentWrapper from '../elements/ContentWrapper'
import ChangePasswordForm from './ChangePasswordForm'
import Button from '../elements/Button'
import Loader from '../elements/Loader'
import { userProfileHeaders, userProfileHeadersToShow } from '../../utils'
import colors from '../../styles/colors'

const Table = styled.table`
  margin: 0 auto;
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
`

const cellStyling = css`
  border: 1px solid red;
  padding: 10px;
  border: 2px solid ${colors.grey3};
`

const TableBody = styled.tbody``

const TableRow = styled.tr``

const HeaderCell = styled.th`
  ${cellStyling}
  background-color: ${colors.grey1};
`

const TableCell = styled.td`
  ${cellStyling}
  background-color: ${colors.grey4};
`

const UserProfile = () => {
  const { user } = useContext(AuthContext)
  const [showForm, setShowForm] = useState(false)

  if (user.loading) {
    return <Loader offset />
  }

  const userData = user.data.me

  return (
    <PageContainer title="User Profile" center>
      <ContentWrapper>
        <Table>
          <TableBody>
            {userProfileHeadersToShow.map(header => (
              <TableRow key={header}>
                <HeaderCell>{userProfileHeaders[header].headerText}</HeaderCell>
                <TableCell data-cy="user-data">{userData[userProfileHeaders[header].id]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          size="medium"
          content={showForm ? 'Cancel' : 'Change Password'}
          onClick={() => setShowForm(!showForm)}
          style={{ margin: '0 auto', display: 'block' }}
          color={showForm && colors.red1}
          dataCy="change-password-btn"
        />
        {showForm && <ChangePasswordForm setShowForm={setShowForm} />}
      </ContentWrapper>
    </PageContainer>
  )
}

export default UserProfile
