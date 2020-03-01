const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require('../../utils/config')
const User = require('../../models/user')
const Conference = require('../../models/conference')
const Division = require('../../models/division')
const { testUser, testConferences, testDivisions } = require('./db-seed-data')

if (process.env.NODE_ENV !== 'test') {
  throw new Error('This script runs only in testing context.')
}

console.log('connecting to the DB')

mongoose.set('useFindAndModify', false)

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB: ', error.message)
  })

const createTestUser = async () => {
  const { username, email, password, isVerified } = testUser

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    usernameLower: username.toLowerCase(),
    email: email.toLowerCase(),
    passwordHash,
    isVerified,
  })

  await user.save()
}

const createConferences = async () => {
  await Conference.insertMany(testConferences)
}

const createDivisions = async () => {
  const conferences = await Conference.find({})

  // Add conference id's in the division data
  const divisionData = testDivisions.map(division => {
    const conference = conferences.find(
      conference => conference.conferenceId === division.conferenceId
    )
    return {
      ...division,
      conference: conference._id,
    }
  })

  // Save divisions
  const divisions = await Division.insertMany(divisionData)

  // Save division id's in the conference data
  const newConferences = conferences.map(conference => {
    const confDivisions = divisions.filter(
      division => String(division.conference) === String(conference._id)
    )

    conference.divisions = confDivisions

    return conference
  })

  // Save conferences with division id's in the db
  const confPromises = newConferences.map(conf => conf.save())
  await Promise.all(confPromises)
}

const runSeed = async () => {
  await createTestUser()
  await createConferences()
  await createDivisions()
}

runSeed()
  .catch(err => {
    console.error('seed-db.runSeed\n', err.stack)
    mongoose.connection.close()
    process.exit(1)
  })
  .then(() => {
    mongoose.connection.close()
    process.exit(0)
  })
