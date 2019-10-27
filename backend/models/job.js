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
  cronTime: {
    type: String,
    required: true,
  },
  repeat: {
    type: Number,
    required: true,
  },
})

const Job = mongoose.model('Job', jobSchema)

module.exports = Job
