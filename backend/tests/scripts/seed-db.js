const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require('../../utils/config')
const User = require('../../models/user')
const Conference = require('../../models/conference')
const Division = require('../../models/division')
const Team = require('../../models/team')
const Player = require('../../models/player')
const {
  testUser,
  testConferences,
  testDivisions,
  testTeams,
  testPlayers,
} = require('./db-seed-data')

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

const createTeams = async () => {
  const conferences = await Conference.find({})
  const divisions = await Division.find({})

  // Add conference and division id's to team objects
  const teamData = testTeams.map(team => {
    const conferenceObj = conferences.find(
      conference => conference.conferenceId === team.conferenceId
    )
    const divisionObj = divisions.find(
      division => division.divisionId === team.divisionId
    )

    return {
      ...team,
      conference: conferenceObj._id,
      division: divisionObj._id,
    }
  })

  const newTeams = await Team.insertMany(teamData)

  // Add teams to conferences
  const newConferences = conferences.map(conference => {
    const teams = newTeams.filter(
      team => String(team.conference) === String(conference._id)
    )

    conference.teams = teams.map(team => team._id)
    return conference
  })

  // Add teams to divisions
  const newDivisions = divisions.map(division => {
    const teams = newTeams.filter(
      team => String(team.division) === String(division._id)
    )

    division.teams = teams.map(team => team._id)
    return division
  })

  // Create promises for saving
  const confPromises = newConferences.map(conf => conf.save())
  const divPromises = newDivisions.map(div => div.save())

  // Save conferences and divisions
  await Promise.all([...confPromises, ...divPromises])
}

const createPlayers = async () => {
  const teams = await Team.find({})

  // Add team id's to players
  const playerData = testPlayers.map(player => {
    const teamObj = teams.find(team => team.teamId === player.teamId)

    return {
      ...player,
      currentTeam: teamObj._id,
    }
  })

  // Add players to the db
  const newPlayers = await Player.insertMany(playerData)

  // Add players to teams
  const newTeams = teams.map(team => {
    const players = newPlayers.filter(
      player => String(player.currentTeam) === String(team._id)
    )

    team.players = players.map(team => team._id)
    return team
  })

  // Create promises for saving
  const teamPromises = newTeams.map(team => team.save())

  // Save teams
  await Promise.all(teamPromises)
}

const runSeed = async () => {
  await createTestUser()
  await createConferences()
  await createDivisions()
  await createTeams()
  await createPlayers()
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
