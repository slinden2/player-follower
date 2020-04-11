/*
This is the test db seeder script.

After resetting the testing db, this script can be used to rebuild it
completely.
*/

const bcrypt = require('bcrypt')
const User = require('../../models/user')
const Conference = require('../../models/conference')
const Division = require('../../models/division')
const Team = require('../../models/team')
const Player = require('../../models/player')
const Linescore = require('../../models/linescore')
const SkaterBoxscore = require('../../models/skater-boxscore')
const GoalieBoxscore = require('../../models/goalie-boxscore')
const {
  testUser,
  testConferences,
  testDivisions,
  testTeams,
  testPlayers,
} = require('./db-seed-data')
const testLinescores = require('./db-seed-linescore-data')
const testBoxscores = require('./db-seed-boxscore-data')

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

const createLinescores = async () => {
  const teams = await Team.find({}, { teamId: 1 })

  // Replaces team and opponentId fields with MongoDB id's
  const linescores = testLinescores.map(linescore => {
    const team = teams.find(team => team.teamId === linescore.team)
    const opponent = teams.find(team => team.teamId === linescore.opponentId)

    return {
      ...linescore,
      team: team._id,
      opponentId: opponent._id,
    }
  })

  const savedLinescores = await Linescore.insertMany(linescores)

  // Save new linescores id's to the teams.
  let teamPromises = []
  teams.forEach(team => {
    const linescores = savedLinescores.filter(
      linescore => String(linescore.team) === String(team._id)
    )

    team.linescores = linescores

    teamPromises = [...teamPromises, team.save()]
  })

  await Promise.all(teamPromises)
}

const createBoxscores = async () => {
  const players = await Player.find({})
  const teams = await Team.find({})

  // Add mongodb id's to the boxscore objects
  const boxscores = testBoxscores.map(boxscore => {
    const homeTeam = teams.find(team => team.teamId === boxscore.homeTeam)
    const awayTeam = teams.find(team => team.teamId === boxscore.awayTeam)
    const player = players.find(player => player.playerId === boxscore.player)

    return {
      ...boxscore,
      homeTeam: homeTeam._id,
      awayTeam: awayTeam._id,
      player: player._id,
    }
  })

  // Get only skater boxscores
  const skaterBoxscores = boxscores.filter(
    boxscore => boxscore.saves === undefined
  )

  // Get only goalie boxscores
  const goalieBoxscores = boxscores.filter(
    boxscore => boxscore.saves !== undefined
  )

  const newSkaterBoxscores = await SkaterBoxscore.insertMany(skaterBoxscores)
  const newGoalieBoxscores = await GoalieBoxscore.insertMany(goalieBoxscores)

  let playerPromises = []

  // Add boxscores in an array under every skater and goalie
  players.forEach(player => {
    let boxscores = []
    const isGoalie = player.primaryPosition === 'G'

    if (isGoalie) {
      boxscores = newGoalieBoxscores.filter(
        boxscore => String(boxscore.player) === String(player._id)
      )
    } else {
      boxscores = newSkaterBoxscores.filter(
        boxscore => String(boxscore.player) === String(player._id)
      )
    }

    player.boxscores = boxscores
    playerPromises = [...playerPromises, player.save()]
  })

  await Promise.all(playerPromises)
}

const seedDb = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('This script runs only in testing context.')
  }

  console.log('seed-db.seedDb.starting-to-seed')

  console.log('seed-db.seedDb.createTestuser')
  await createTestUser()
  console.log('seed-db.seedDb.createConferences')
  await createConferences()
  console.log('seed-db.seedDb.createDivisions')
  await createDivisions()
  console.log('seed-db.seedDb.createTeams')
  await createTeams()
  console.log('seed-db.seedDb.createPlayers')
  await createPlayers()
  console.log('seed-db.seedDb.createLinescores')
  await createLinescores()
  console.log('seed-db.seedDb.createBoxscores')
  await createBoxscores()

  console.log('seed-db.seedDb.seed-done')
}

module.exports = seedDb
