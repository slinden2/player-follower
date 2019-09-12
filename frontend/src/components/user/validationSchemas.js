import * as yup from 'yup'

const username = yup
  .string()
  .min(2, 'Username must be at least 2 characters long.')
  .max(12, "Username can't be longer than 12 characters long.")
  .required('Username is required.')

const email = yup
  .string()
  .email('Invalid email address.')
  .required('Email is required.')

const confirmPassword = yup
  .string()
  .oneOf([yup.ref('password'), null], 'Passwords must match.')
  .required('Confirm password is required.')

const confirmNewPassword = yup
  .string()
  .oneOf([yup.ref('newPassword'), null], 'Passwords must match.')
  .required('Confirm password is required.')

const password = yup
  .string()
  // .min(8, 'Password must be at least 8 characters long.')
  // .max(50, "Password can't be longer than 50 characters.")
  // .required('Password is required.')
  // .matches(
  //   /(?=.*[a-z])/,
  //   'Password must contain at least one lowercase letter.'
  // )
  // .matches(/(?=.*[0-9])/, 'Password must contain at least one number.')

export const signupSchema = yup.object().shape({
  username,
  email,
  password,
  confirmPassword,
})

export const loginSchema = yup.object().shape({
  username,
  password: yup.string().required('Password is required.'),
})

export const forgotPasswordSchema = yup.object().shape({
  email,
})

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('Password is required.'),
  newPassword: password,
  confirmNewPassword,
})
