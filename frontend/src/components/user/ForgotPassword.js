import React, { useContext } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Formik } from 'formik'
import { event } from '../../utils/tracking'
import { forgotPasswordSchema } from './validationSchemas'
import { FORGOT_PASSWORD } from '../../graphql/mutations'
import { NotificationContext } from '../../contexts/NotificationContext'
import Notification from '../Notification'
import Link from '../elements/StyledLink'
import Button from '../elements/Button'
import {
  Container,
  SForm,
  SField,
  Label,
  TextRow,
  Input,
} from '../../styles/forms'
import FormError from './FormError'
import { ModalContext } from '../../contexts/ModalContext'
import { fromPromise } from 'apollo-link'

const ForgotPassword = ({ history, onModal }) => {
  const { closeModal, navigateTo } = useContext(ModalContext)
  const { notification, setNotification, handleException } = useContext(
    NotificationContext
  )
  const forgotPassword = useMutation(FORGOT_PASSWORD)

  const handleForgotPassword = async (
    { email },
    { resetForm, setSubmitting }
  ) => {
    try {
      const newEmail = await forgotPassword({
        variables: {
          email,
        },
      })
      setNotification(
        'positive',
        `The password reset link has been set to ${newEmail.data.forgotPassword.email}. Please click the link to change your password.`,
        'site'
      )
      event('FORM', 'Forgot Password Form Submit')
      history.push('/')
      if (onModal) closeModal()
    } catch (exception) {
      handleException(exception, 'form')
      resetForm()
      setSubmitting(false)
    }
  }

  return (
    <Container>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleForgotPassword}
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
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                <FormError
                  message={errors.email}
                  show={errors.email && touched.email}
                />
              </SField>
              <TextRow>
                Already have an account?{' '}
                {onModal ? (
                  <Link name="Log In" onClick={() => navigateTo('log in')}>
                    Register
                  </Link>
                ) : (
                  <Link to="/login" name="Log In">
                    Register
                  </Link>
                )}
              </TextRow>
              <br />
              <Notification position="form" notification={notification} />
              <br />
              <Button
                type="submit"
                size="big"
                fontCase="uppercase"
                content="Reset Password"
                disabled={isSubmitting}
              />
            </SForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export default ForgotPassword
