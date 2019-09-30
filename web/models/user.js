const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, 'username must be at least 3 characters long'],
  },
  usernameLower: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: value => {
        const re = /\S+@\S+\.\S+/
        return re.test(value)
      },
      message: props => `${props.value} is not a valid email address`,
    },
  },
  passwordHash: String,
  isVerified: Boolean,
  favoritePlayers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User
