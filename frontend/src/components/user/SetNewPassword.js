import React, { useContext } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Formik } from 'formik'
import { event } from '../../utils/tracking'
import { SET_NEW_PASSWORD } from '../../graphql/mutations'
import { NotificationContext } from '../../contexts/NotificationContext'
import PageContainer from '../elements/PageContainer'
import ContentWrapper from '../elements/ContentWrapper'
import { Container, SForm, SField, Label, Input } from '../../styles/forms'
import FormError from './FormError'
import { setNewPasswordSchema } from './validationSchemas'
import Notification from '../Notification'
import Button from '../elements/Button'
import colors from '../../styles/colors'

const SetNewPassword = ({ history, token }) => {
  const { notification, setNotification, handleException } = useContext(
    NotificationContext
  )
  const setNewPassword = useMutation(SET_NEW_PASSWORD)

  const handleSetNewPassword = async (
    { newPassword },
    { resetForm, setSubmitting }
  ) => {
    try {
      await setNewPassword({ variables: { token, password: newPassword } })
      setNotification(
        'positive',
        'Your password has been changed. You may now log in with the new password.',
        'site'
      )
      event('FORM', 'Set New Password Form Submit')
      history.push('/')
    } catch (exception) {
      handleException(exception, 'form')
      resetForm()
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    history.push('/')
  }

  return (
    <PageContainer title='Set New Password'>
      <ContentWrapper>
        <Container>
          <Formik
            initialValues={{ newPassword: '', confirmNewPassword: '' }}
            validationSchema={setNewPasswordSchema}
            onSubmit={handleSetNewPassword}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleChange,
              handleBlur,
            }) => {
              return (
                <SForm>
                  <SField>
                    <Label htmlFor='newPassword'>New Password</Label>
                    <Input
                      name='newPassword'
                      type='password'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.newPassword}
                    />
                    <FormError
                      message={errors.newPassword}
                      show={errors.newPassword && touched.newPassword}
                    />
                  </SField>
                  <SField>
                    <Label htmlFor='confirmNewPassword'>
                      Confirm New Password
                    </Label>
                    <Input
                      name='confirmNewPassword'
                      type='password'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.confirmNewPassword}
                    />
                    <FormError
                      message={errors.confirmNewPassword}
                      show={
                        errors.confirmNewPassword && touched.confirmNewPassword
                      }
                    />
                  </SField>
                  <br />
                  <Notification position='form' notification={notification} />
                  <br />

                  <Button
                    type='submit'
                    size='big'
                    fontCase='uppercase'
                    content='Save Password'
                    disabled={isSubmitting}
                    style={{ marginRight: '10px' }}
                    dataCy='save-button'
                  />
                  <Button
                    type='button'
                    size='big'
                    fontCase='uppercase'
                    content='Cancel'
                    color={colors.red1}
                    onClick={handleCancel}
                    style={{ marginLeft: '10px' }}
                    dataCy='cancel-button'
                  />
                </SForm>
              )
            }}
          </Formik>
        </Container>
      </ContentWrapper>
    </PageContainer>
  )
}

export default SetNewPassword
