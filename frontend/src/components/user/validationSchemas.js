import * as yup from 'yup'

const name = yup
  .string()
  .max(50, "Name can't be longer than 50 characters.")
  .required('Name is required.')

const subject = yup
  .string()
  .min(3, 'Subject must be at least 3 characters long.')
  .max(50, "Subject can't be longer than 50 characters.")
  .required('Subject is required.')

const message = yup
  .string()
  .min(10, 'Message must be at least 10 characters long.')
  .max(5000, "Message can't be longer than 5000 characters.")
  .required('Message is required.')

const username = yup
  .string()
  .min(2, 'Username must be at least 2 characters long.')
  .max(12, "Username can't be longer than 12 characters.")
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
  .min(8, 'Password must be at least 8 characters long.')
  .max(50, "Password can't be longer than 50 characters.")
  .required('Password is required.')
  .matches(
    /(?=.*[a-z])/,
    'Password must contain at least one lowercase letter.'
  )
  .matches(/(?=.*[0-9])/, 'Password must contain at least one number.')

export const signupSchema = yup.object().shape({
  username,
  email,
  password,
  confirmPassword,
})

export const loginSchema = yup.object().shape({
  username: yup.string().required('Username or email is required.'),
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

export const setNewPasswordSchema = yup.object().shape({
  newPassword: password,
  confirmNewPassword,
})

export const contactSchema = yup.object().shape({
  name,
  email,
  subject,
  message,
})
