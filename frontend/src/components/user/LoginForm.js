import React, { useContext } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Formik } from 'formik'
import * as yup from 'yup'
import { LOGIN } from '../../graphql/mutations'
import { NotificationContext } from '../../contexts/NotificationContext'
import { AuthContext } from '../../contexts/AuthContext'
import Link from '../elements/StyledLink'
import {
  Container,
  SForm,
  SField,
  Label,
  TextRow,
  Input,
  FormButton,
} from '../../styles/forms'
import FormError from './FormError'

const loginSchema = yup.object().shape({
  username: yup.string().required('Username is required.'),
  password: yup.string().required('Password is required.'),
})

const LoginForm = ({ history, closeModal }) => {
  const { setNotification, handleException } = useContext(NotificationContext)
  const { loginUser } = useContext(AuthContext)

  const login = useMutation(LOGIN)

  const handleLogin = async (
    { username, password },
    { resetForm, setSubmitting }
  ) => {
    try {
      const token = await login({
        variables: {
          username,
          password,
        },
      })
      setNotification('positive', `${username} successfully logged in.`)
      loginUser(token.data.login.value)
      if (closeModal) closeModal()
      history.push('/')
    } catch (exception) {
      handleException(exception)
      resetForm()
      setSubmitting(false)
    }
  }

  return (
    <Container>
      <Formik
        initialValues={{ username: '', password: '' }}
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
                <Input name="username" />
                <FormError
                  message={errors.username}
                  show={errors.username && touched.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
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
                <Link to="/signup" name="Register">
                  Register
                </Link>
              </TextRow>
              <TextRow>
                <Link to="/forgot-password" name="Forgot your password?">
                  Forgot your password?
                </Link>
              </TextRow>
              <br />
              <FormButton
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
