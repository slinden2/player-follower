import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Loader, Image, Header, List, Divider, Table } from 'semantic-ui-react'
import { profileImgUrl } from '../utils'
import { PLAYER_PROFILE } from '../graphql/queries'
import PlayerMilestones from './PlayerMilestones'

const positions = {
  R: 'Right Wing',
  L: 'Left Wing',
  C: 'Center',
  D: 'Defenceman',
}

const headers = [
  { headerText: 'Date', prop: 'gameDate' },
  { headerText: 'Teams', prop: 'teams' },
  { headerText: 'G', prop: 'goals' },
  { headerText: 'A', prop: 'assists' },
  { headerText: 'P', prop: 'points' },
  { headerText: '+/-', prop: 'plusMinus' },
  { headerText: 'PM', prop: 'penaltyMinutes' },
  { headerText: 'PPG', prop: 'powerPlayGoals' },
  { headerText: 'PPA', prop: 'powerPlayAssists' },
  { headerText: 'SHG', prop: 'shortHandedGoals' },
  { headerText: 'SHA', prop: 'shortHandedAssists' },
  { headerText: 'TON', prop: 'timeOnIce' },
  { headerText: 'PPTON', prop: 'powerPlayTimeOnIce' },
  { headerText: 'SHTON', prop: 'shortHandedTimeOnIce' },
  { headerText: 'Shots', prop: 'shots' },
  { headerText: 'Shot%', prop: 'shotPct' },
  { headerText: 'Blocked', prop: 'blocked' },
  { headerText: 'Hits', prop: 'hits' },
  { headerText: 'Giveaways', prop: 'giveaways' },
  { headerText: 'Takeaways', prop: 'takeaways' },
]

const sortBoxscoresByDate = boxscores => {
  return boxscores.sort((a, b) => {
    a = a.gameDate.split('/').join('')
    b = b.gameDate.split('/').join('')
    return a < b ? 1 : a > b ? -1 : 0
  })
}

const PlayerProfile = ({ siteLink }) => {
  const [selectedGamePk, setSelectedGamePk] = useState(null)
  const { data, loading } = useQuery(PLAYER_PROFILE, {
    variables: { siteLink },
  })

  if (loading) {
    return <Loader active inline="centered" />
  }

  const player = data.findPlayer
  player.boxscores = sortBoxscoresByDate(player.boxscores)
  const gamePks = player.boxscores.map(boxscore => boxscore.gamePk)

  const createHeaders = () => (
    <Table.Row>
      {headers.map(header => (
        <Table.HeaderCell key={header.headerText}>
          {header.headerText}
        </Table.HeaderCell>
      ))}
    </Table.Row>
  )

  const createCells = () =>
    player.boxscores.map(game => (
      <Table.Row
        key={game.gameDate}
        onClick={() => setSelectedGamePk([game.gamePk])}
      >
        {headers.map(stat => {
          if (stat.prop === 'teams') {
            return (
              <Table.Cell key={stat.prop}>{`${game.awayTeam.abbreviation}@${
                game.homeTeam.abbreviation
              }`}</Table.Cell>
            )
          }
          return <Table.Cell key={stat.prop}>{game[stat.prop]}</Table.Cell>
        })}
      </Table.Row>
    ))

  return (
    <div>
      <Image src={profileImgUrl(data.findPlayer.playerId)} fluid />
      <Header size="huge">{player.fullName}</Header>
      <List>
        <List.Item>
          <strong>Birthdate:</strong> {player.birthDate}
        </List.Item>
        <List.Item>
          <strong>Birth City:</strong> {player.birthCity}
        </List.Item>
        {player.birthStateProvince && (
          <List.Item>
            <strong>Birth State:</strong> {player.birthStateProvince}
          </List.Item>
        )}
        <List.Item>
          <strong>Nationality:</strong> {player.nationality}
        </List.Item>
        <List.Item>
          <strong>Team:</strong> {player.currentTeam.name}
        </List.Item>
        <List.Item>
          <strong>Position:</strong> {positions[player.primaryPosition]}
        </List.Item>
      </List>
      <Divider />
      <Header size="huge">Performance Game-by-Game</Header>
      <Table celled>
        <Table.Header>{createHeaders()}</Table.Header>
        <Table.Body>{createCells()}</Table.Body>
      </Table>
      <Divider />
      <PlayerMilestones
        playerId={player.playerId}
        gamePks={gamePks.slice(0, 5)}
        selectedGamePk={selectedGamePk}
        setSelectedGamePk={setSelectedGamePk}
        boxscores={player.boxscores}
      />
    </div>
  )
}

export default PlayerProfile
