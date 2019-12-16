import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-apollo-hooks'
import Loader from '../elements/Loader'
import { formatDate } from '../../utils'
import { PlayerMilestone } from './PlayerMilestone'
import { Container, Header } from './milestoneStyles'

const getGoalType = strength => {
  const strengths = {
    EVEN: 'an even-strength',
    PPG: 'a powerplay',
    SHG: 'a shorthanded',
  }
  return strengths[strength]
}

const ProfilePlayerMilestones = props => {
  const { query, variables } = props

  const { data, loading } = useQuery(query, { variables })

  if (loading) {
    return <Loader />
  }

  const milestones = data.GetMilestones

  const createMilestones = () =>
    milestones.map(milestone => {
      const title = (
        <>
          {`${formatDate(milestone.gameDate)} - vs `}
          <Link to={`/teams/${milestone.opponent.siteLink}`}>
            {milestone.opponent.abbreviation}
          </Link>
        </>
      )

      const description = (
        <>
          <Link to={milestone.scorer.siteLink}>
            {milestone.scorer.lastName}
          </Link>
          {milestone.periodNumber !== 'SO'
            ? ` scores ${getGoalType(
                milestone.strength
              )} goal with a ${milestone.shotType.toLowerCase()} ${
                milestone.periodTime
              } into ${milestone.periodNumber}.`
            : `${milestone.scorer.lastName} scores in a shootout.`}
        </>
      )

      const assist1String = milestone.assist1 && (
        <>
          {' - '}
          <Link to={milestone.assist1.siteLink}>
            {milestone.assist1.lastName}
          </Link>
        </>
      )

      const assist2String = milestone.assist2 && (
        <>
          {' - '}
          <Link to={milestone.assist2.siteLink}>
            {milestone.assist2.lastName}
          </Link>
        </>
      )

      const goalieString = milestone.goalie && (
        <>
          {' on '}
          <Link to={milestone.goalie.siteLink}>
            {milestone.goalie.lastName}
          </Link>
        </>
      )

      const scoreString = (
        <>
          <Link to={milestone.scorer.siteLink}>
            {milestone.scorer.lastName}
          </Link>
          {assist1String}
          {assist2String}
          {goalieString}
        </>
      )

      return (
        <PlayerMilestone
          key={milestone._id}
          data={milestone}
          title={title}
          description={description}
          scoreText={scoreString}
          videoId={milestone.highlight.playbackId}
        />
      )
    })

  return (
    <Container>
      <Header>Highlights</Header>
      {createMilestones()}
    </Container>
  )
}

export default ProfilePlayerMilestones
