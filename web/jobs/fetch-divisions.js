const axios = require('axios')
const mongoose = require('mongoose')
const Conference = require('../models/conference')
const Division = require('../models/division')
const config = require('../utils/config')

if (
  process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'staging'
) {
  require('dotenv').config()
}

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

const divionsUrl = 'https://statsapi.web.nhl.com/api/v1/divisions'

const fetchDivisions = async () => {
  try {
    const response = await axios.get(divionsUrl)
    for (const division of response.data.divisions) {
      const divisionInDb = await Division.findOne({
        divisionId: division.id,
      })
      if (divisionInDb) continue

      const conference = await Conference.findOne({
        conferenceId: division.conference.id,
      })

      const newDivision = new Division({
        divisionId: division.id,
        link: division.link,
        name: division.name,
        shortName: division.nameShort,
        abbreviation: division.abbreviation,
        conference: conference._id,
        active: division.active,
      })

      const savedDivision = await newDivision.save()
      conference.divisions = conference.divisions.concat(savedDivision._id)
      await conference.save()
    }
  } catch ({ name, message }) {
    console.error('fetch-divisions.fetchDivisions')
    console.error(`${name}: ${message}`)
  }
}

fetchDivisions().then(() => mongoose.connection.close())
