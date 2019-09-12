const { UserInputError } = require('apollo-server')

const validatePassword = password => {
  if (password.length < 8) {
    throw new UserInputError(
      'Invalid password. The minimum length is 8 characters.'
    )
  }

  const oneLowerCase = /(?=.*[a-z])/.test(password)
  if (!oneLowerCase) {
    throw new UserInputError(
      'Invalid password. It must contain at least 1 lowercase character.'
    )
  }

  const oneNumber = /(?=.*[0-9])/.test(password)
  if (!oneNumber) {
    throw new UserInputError(
      'Invalid password. It must contain at least 1 number.'
    )
  }

  return true
}

module.exports = { validatePassword }
