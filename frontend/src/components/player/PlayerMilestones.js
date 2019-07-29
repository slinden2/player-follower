import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Loader, Header, Divider, Button } from 'semantic-ui-react'
import { PLAYER_MILESTONES } from '../../graphql/queries'

const getDate = (gamePk, boxscores) => {
  const score = boxscores.find(boxscore => boxscore.gamePk === gamePk)
  return score.gameDate
}

const PlayerMilestones = ({
  playerId,
  gamePks,
  selectedGamePk,
  setSelectedGamePk,
  boxscores,
}) => {
  const { data, loading } = useQuery(PLAYER_MILESTONES, {
    variables: { playerId, gamePks: selectedGamePk || gamePks },
  })

  if (loading) {
    return <Loader active inline="centered" />
  }

  const milestones = data.GetMilestones.filter(milestone => milestone.length)

  const createMilestones = () =>
    milestones.map(game =>
      game.map(milestone => (
        <div key={milestone.title}>
          <Header>{milestone.title}</Header>
          <div>
            {getDate(milestone.gamePk, boxscores)}{' '}
            {milestone.blurb.split(':')[0]}
          </div>
          <video
            width={milestone.playback.width}
            height={milestone.playback.height}
            controls
          >
            <source src={milestone.playback.url} />
          </video>
          <div>{milestone.description}</div>
          <Divider />
        </div>
      ))
    )

  return (
    <div>
      <Header>
        Highlights{' '}
        {selectedGamePk ? (
          <Button
            primary
            size="mini"
            content="Last 5 games"
            onClick={() => setSelectedGamePk(null)}
          />
        ) : (
          '| Last 5 games'
        )}{' '}
      </Header>
      {createMilestones()}
    </div>
  )
}

export default PlayerMilestones
