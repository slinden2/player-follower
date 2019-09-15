import React, { useContext } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Formik } from 'formik'
import { event } from '../../utils/tracking'
import { loginSchema } from './validationSchemas'
import { LOGIN } from '../../graphql/mutations'
import { NotificationContext } from '../../contexts/NotificationContext'
import { AuthContext } from '../../contexts/AuthContext'
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
  Checkbox,
} from '../../styles/forms'
import FormError from './FormError'
import { ModalContext } from '../../contexts/ModalContext'
import { getCookie } from '../../utils'

const LoginForm = ({ history, onModal }) => {
  const { closeModal, navigateTo } = useContext(ModalContext)
  const { notification, setNotification, handleException } = useContext(
    NotificationContext
  )
  const { loginUser } = useContext(AuthContext)

  const login = useMutation(LOGIN)

  const handleLogin = async (
    { username, password, rememberMe },
    { resetForm, setSubmitting }
  ) => {
    try {
      if (!getCookie('funcConsent')) {
        throw new Error('You must accept cookies prior to login.')
      }

      const token = await login({
        variables: {
          username,
          password,
        },
      })
      event('FORM', 'Login Form Submit')
      // If user has set rememberMe the cookie expires in one year.
      // If not, it will be a normal session cookie.
      loginUser(token.data.login.value, rememberMe ? 365 : 0)
      setNotification('positive', `${username} successfully logged in.`, 'site')
      if (onModal) closeModal()
      history.push('/')
    } catch (exception) {
      handleException(exception, 'form')
      resetForm()
      setSubmitting(false)
    }
  }

  return (
    <Container>
      <Formik
        initialValues={{ username: '', password: '', rememberMe: true }}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
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
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  name="username"
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
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                <FormError
                  message={errors.password}
                  show={errors.password && touched.password}
                />
              </SField>
              <TextRow>
                Don't have an account?{' '}
                {onModal ? (
                  <Link name="Register" onClick={() => navigateTo('sign up')}>
                    Register
                  </Link>
                ) : (
                  <Link to="/signup" name="Register">
                    Register
                  </Link>
                )}
              </TextRow>
              <TextRow>
                {onModal ? (
                  <Link
                    name="Forgot your password?"
                    onClick={() => navigateTo('forgot password')}
                  >
                    Forgot your password?
                  </Link>
                ) : (
                  <Link to="/forgot-password" name="Forgot your password?">
                    Forgot your password?
                  </Link>
                )}
              </TextRow>

              <Label htmlFor="rememberMe">
                Keep me logged in
                <Checkbox
                  type="checkbox"
                  name="rememberMe"
                  checked={values.rememberMe}
                  style={{ marginLeft: '10px' }}
                />
              </Label>

              <br />
              <Notification position="form" notification={notification} />
              <br />
              <Button
                type="submit"
                size="big"
                fontCase="uppercase"
                content="Log In"
                disabled={isSubmitting}
              />
            </SForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export default LoginForm
