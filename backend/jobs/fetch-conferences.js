const axios = require('axios')
const mongoose = require('mongoose')
const Conference = require('../models/conference')
const config = require('../utils/config')

if (
  process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'staging'
) {
  require('dotenv').config()
}

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const conferenceUrl = 'https://statsapi.web.nhl.com/api/v1/conferences'

const fetchConferences = async () => {
  try {
    const response = await axios.get(conferenceUrl)
    for (const conference of response.data.conferences) {
      const conferenceInDb = await Conference.findOne({
        conferenceId: conference.id,
      })
      if (conferenceInDb) continue

      const newConference = new Conference({
        conferenceId: conference.id,
        link: conference.link,
        name: conference.name,
        shortName: conference.shortName,
        abbreviation: conference.abbreviation,
        active: conference.active,
      })
      await newConference.save()
    }
  } catch ({ name, message }) {
    console.error('fetch-conferences.fetchConferences')
    console.error(`${name}: ${message}`)
  }
}

fetchConferences().then(() => mongoose.connection.close())
