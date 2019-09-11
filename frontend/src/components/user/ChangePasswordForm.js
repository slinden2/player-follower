import React, { useContext } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Formik } from 'formik'
import { CHANGE_PASSWORD } from '../../graphql/mutations'
import { changePasswordSchema } from './validationSchemas'
import { Container, SForm, SField, Label, Input } from '../../styles/forms'
import FormError from './FormError'
import Notification from '../Notification'
import { NotificationContext } from '../../contexts/NotificationContext'
import Button from '../elements/Button'

const ChangePasswordForm = ({ setShowForm }) => {
  const { notification, setNotification, handleException } = useContext(
    NotificationContext
  )
  const changePassword = useMutation(CHANGE_PASSWORD)

  const handleChangePassword = async (
    { oldPassword, newPassword },
    { resetForm, setSubmitting }
  ) => {
    try {
      const res = await changePassword({
        variables: { oldPassword, newPassword },
      })
      setShowForm(false)
      setNotification('positive', 'Your password has been changed.', 'site')
    } catch (exception) {
      handleException(exception, 'site')
      resetForm()
      setSubmitting(false)
    }
  }

  return (
    <Container>
      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }}
        validationSchema={changePasswordSchema}
        onSubmit={handleChangePassword}
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
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input
                  name="oldPassword"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.oldPassword}
                />
                <FormError
                  message={errors.oldPassword}
                  show={errors.oldPassword && touched.oldPassword}
                />
              </SField>
              <SField>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  name="newPassword"
                  type="password"
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
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  name="confirmNewPassword"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmNewPassword}
                />
                <FormError
                  message={errors.confirmNewPassword}
                  show={errors.confirmNewPassword && touched.confirmNewPassword}
                />
              </SField>
              <br />
              <Notification position="form" notification={notification} />
              <br />
              <Button
                as={Button}
                type="submit"
                size="big"
                fontCase="uppercase"
                content="Change Password"
                disabled={isSubmitting}
              />
            </SForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export default ChangePasswordForm
