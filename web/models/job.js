const mongoose = require('mongoose')

const messageSchema = mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    queue: {
      type: String,
      required: true,
    },
    dataId: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

const jobSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: messageSchema,
  execTime: {
    type: Date,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
})

jobSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  },
})

const Job = mongoose.model('Job', jobSchema)

module.exports = Job
