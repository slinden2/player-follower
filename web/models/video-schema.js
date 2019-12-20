const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const playbackSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    width: {
      type: {},
    },
    height: {
      type: {},
    },
    url: {
      type: String,
      // required: true,
      unique: true,
      sparse: true,
    },
  },
  { id_: false }
)

playbackSchema.plugin(uniqueValidator)

const videoSchema = mongoose.Schema({
  videoId: {
    type: Number,
    required: true,
    unique: true,
    sparse: true,
  },
  title: {
    type: String,
    required: true,
  },
  blurb: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  mediaPlaybackId: {
    type: Number,
    required: true,
  },
  playbacks: [playbackSchema],
})

videoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  },
})

videoSchema.plugin(uniqueValidator)

module.exports = videoSchema
