import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Loader, Header, Divider } from 'semantic-ui-react'
import { PLAYER_MILESTONES } from '../graphql/queries'

const PlayerMilestones = ({ playerId, gamePks }) => {
  const { data, loading } = useQuery(PLAYER_MILESTONES, {
    variables: { playerId, gamePks },
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
          <p>{milestone.blurb.split(':')[0]}</p>
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
      <Header>Highlights</Header>
      {createMilestones()}
    </div>
  )
}

export default PlayerMilestones
