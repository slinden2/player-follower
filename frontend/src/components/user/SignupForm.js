import React, { useContext, useRef } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Formik } from 'formik'
import Reaptcha from 'reaptcha'
import { event } from '../../utils/tracking'
import { signupSchema } from './validationSchemas'
import { CREATE_USER } from '../../graphql/mutations'
import { NotificationContext } from '../../contexts/NotificationContext'
import {
  Container,
  SForm,
  SField,
  Label,
  TextRow,
  Input,
  ReCaptchaContainer,
} from '../../styles/forms'
import FormError from './FormError'
import Link from '../elements/StyledLink'
import Button from '../elements/Button'
import Notification from '../Notification'
import { ModalContext } from '../../contexts/ModalContext'

const SignupForm = ({ history, onModal }) => {
  const { closeModal, navigateTo } = useContext(ModalContext)
  const { notification, setNotification, handleException } = useContext(
    NotificationContext
  )
  const recaptchaRef = useRef(null)

  const createUser = useMutation(CREATE_USER)

  const handleSignup = async (
    { username, email, password, recaptcha },
    { resetForm, setSubmitting }
  ) => {
    try {
      const createdUser = await createUser({
        variables: {
          username,
          email,
          password,
          recaptcha,
        },
      })
      setNotification(
        'positive',
        `An account for ${createdUser.data.CreateUser.username} has been created. Before logging in, you must activate your account by clicking the activation link sent to ${email}.`,
        'site'
      )
      event('FORM', 'Signup Form Submit')
      history.push('/')
      if (onModal) closeModal()
    } catch (exception) {
      handleException(exception, 'form')
      resetForm()
      setSubmitting(false)
      recaptchaRef.current.reset()
      return
    }
  }

  return (
    <Container>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          recaptcha: '',
        }}
        validationSchema={signupSchema}
        onSubmit={handleSignup}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
          setFieldValue,
        }) => (
          <SForm>
            <SField>
              <Label htmlFor='username'>Username</Label>
              <Input
                type='text'
                name='username'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
              />
              <FormError
                message={errors.username}
                show={errors.username && touched.username}
              />
            </SField>
            <SField>
              <Label htmlFor='email'>Email</Label>
              <Input
                type='text'
                name='email'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              <FormError
                message={errors.email}
                show={errors.email && touched.email}
              />
            </SField>
            <SField>
              <Label htmlFor='password'>Password</Label>
              <Input
                type='password'
                name='password'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              <FormError
                message={errors.password}
                show={errors.password && touched.password}
              />
            </SField>
            <SField>
              <Label htmlFor='confirm-password'>Confirm Password</Label>
              <Input
                type='password'
                name='confirmPassword'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
              />
              <FormError
                message={errors.confirmPassword}
                show={errors.confirmPassword && touched.confirmPassword}
              />
            </SField>
            <TextRow>
              Already have an account?{' '}
              {onModal ? (
                <Link name='Log In' onClick={() => navigateTo('log in')}>
                  Register
                </Link>
              ) : (
                <Link to='/login' name='Log In'>
                  Register
                </Link>
              )}
            </TextRow>
            <br />
            <Notification position='form' notification={notification} />
            <br />
            <ReCaptchaContainer>
              <Reaptcha
                ref={recaptchaRef}
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY_V2}
                onVerify={token => setFieldValue('recaptcha', token)}
                theme='dark'
              />
            </ReCaptchaContainer>
            <FormError
              message={errors.recaptcha}
              show={
                errors.recaptcha &&
                touched.username &&
                touched.password &&
                touched.email &&
                touched.confirmPassword
              }
            />
            <br />
            <Button
              type='submit'
              size='big'
              fontCase='uppercase'
              content='Sign Up'
              disabled={isSubmitting}
            />
          </SForm>
        )}
      </Formik>
    </Container>
  )
}

export default SignupForm
