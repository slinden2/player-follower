const Team = require('../../models/team')
const Player = require('../../models/player')
const {
  generateTeamSiteLink,
  convertFtToCm,
  convertLbsToKg,
} = require('../helpers/fetch-helpers')

const createPlayers = async (data, newPlayers, gamePk) => {
  const dataPerTeam = [data.away, data.home]

  for (const team of dataPerTeam) {
    const teamInDb = await Team.findOne({ teamId: team.team.id })

    const playerArray = []
    for (const id of newPlayers) {
      const newData = team.players[`ID${id}`]
      if (newData) playerArray.push(newData)
    }

    let finalPlayerArray = []

    for (const player of playerArray) {
      try {
        const boxscoreType =
          player.person.primaryPosition.code === 'G'
            ? 'GoalieBoxscore'
            : 'SkaterBoxscore'

        finalPlayerArray = [
          ...finalPlayerArray,
          {
            playerId: player.person.id,
            firstName: player.person.firstName,
            lastName: player.person.lastName,
            primaryNumber: player.person.primaryNumber,
            link: player.person.link,
            siteLink: generateTeamSiteLink(player.person.fullName),
            birthDate: player.person.birthDate,
            birthCity: player.person.birthCity,
            birthStateProvince: player.person.birthStateProvince,
            birthCountry: player.person.birthCountry,
            nationality: player.person.nationality,
            height: convertFtToCm(player.person.height),
            weight: convertLbsToKg(player.person.weight),
            alternateCaptain: player.person.alternateCaptain || false,
            captain: player.person.captain || false,
            rookie: player.person.rookie,
            shootsCatches: player.person.shootsCatches,
            rosterStatus: player.person.rosterStatus,
            currentTeam: teamInDb._id,
            primaryPosition: player.person.primaryPosition.code,
            active: player.person.active,
            boxscoreType,
          },
        ]
      } catch (exception) {
        console.log(exception)
        console.log(
          `Error while fetching game ${gamePk}. The playerId being fetched was ${player.person.id}.`
        )
        continue
      }
    }

    const insertedPlayers = await Player.insertMany(finalPlayerArray, {
      ordered: false,
    })

    teamInDb.players = [
      ...teamInDb.players,
      ...insertedPlayers.map(player => player._id),
    ]
    await teamInDb.save()
  }
}

module.exports = createPlayers
