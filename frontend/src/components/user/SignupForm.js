import React, { useContext } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { Formik } from 'formik'
import * as yup from 'yup'
import { CREATE_USER } from '../../graphql/mutations'
import { NotificationContext } from '../../contexts/NotificationContext'
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
import Link from '../elements/StyledLink'
import Notification from '../Notification'
import { ModalContext } from '../../contexts/ModalContext'

const signupSchema = yup.object().shape({
  username: yup
    .string()
    .min(2, 'Username must be at least 2 characters long.')
    .max(12, "Username can't be longer than 12 characters long.")
    .required('Username is required.'),
  email: yup
    .string()
    .email('Invalid email address.')
    .required('Email is required.'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(50, "Password can't be longer than 50 character long.")
    .required('Password is required.')
    .matches(
      /(?=.*[a-z])/,
      'Password must contain at least one lowercase letter.'
    )
    .matches(/(?=.*[0-9])/, 'Password must contian at least one number.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match.')
    .required('Confirm password is required.'),
})

const SignupForm = ({ history, onModal }) => {
  const { closeModal, navigateTo } = useContext(ModalContext)
  const { notification, setNotification, handleException } = useContext(
    NotificationContext
  )

  const createUser = useMutation(CREATE_USER)

  const handleSignup = async (
    { username, email, password },
    { resetForm, setSubmitting }
  ) => {
    try {
      await createUser({
        variables: {
          username,
          email,
          password,
        },
      })
    } catch (exception) {
      handleException(exception, 'form')
      resetForm()
      setSubmitting(false)
      if (onModal) closeModal()
      return
    }
    setNotification(
      'positive',
      `An account for ${username} has been created. Before logging in, you must activate your account by clicking the activation link sent to ${email.value}.`
    )
    history.push('/')
  }

  return (
    <Container>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
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
        }) => (
          <SForm>
            <SField>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
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
              <Label htmlFor="email">Email</Label>
              <Input
                type="text"
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
            <SField>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
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
            <FormButton
              type="submit"
              size="big"
              fontCase="uppercase"
              content="Sign Up"
              disabled={isSubmitting}
            />
          </SForm>
        )}
      </Formik>
    </Container>
  )
}

export default SignupForm
