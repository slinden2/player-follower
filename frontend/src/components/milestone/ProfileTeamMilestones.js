import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-apollo-hooks'
import Loader from '../elements/Loader'
import { Container, Header } from './milestoneStyles'
import { formatDate } from '../../utils'
import TeamMilestone from './TeamMilestone'

const ProfileTeamMilestones = props => {
  const { query, variables } = props

  const { data, loading } = useQuery(query, { variables })

  if (loading) {
    return <Loader />
  }

  const milestones = data.GetGameRecaps

  const createMilestones = () =>
    milestones.map(milestone => {
      const title = (
        <>
          {`${formatDate(milestone.gameRecap.gameDate)} - `}
          <Link to={`/teams/${milestone.gameRecap.awayTeam.siteLink}`}>
            {milestone.gameRecap.awayTeam.abbreviation}
          </Link>
          {' @ '}
          <Link to={`/teams/${milestone.gameRecap.homeTeam.siteLink}`}>
            {milestone.gameRecap.homeTeam.abbreviation}
          </Link>
        </>
      )

      const condensed = {
        description: milestone.gameCondensed.description,
        playbackId: milestone.gameCondensed.mediaPlaybackId,
        highlight: milestone.gameCondensed.highlight,
      }

      const recap = {
        description: milestone.gameRecap.title,
        playbackId: milestone.gameRecap.mediaPlaybackId,
        highlight: milestone.gameRecap.highlight,
      }

      return (
        <TeamMilestone
          key={milestone.gameRecap._id}
          title={title}
          gameDate={milestone.gameRecap.gameDate}
          condensed={condensed}
          recap={recap}
        />
      )
    })

  return (
    <Container>
      <Header>Game Recaps</Header>
      {createMilestones()}
    </Container>
  )
}

export default ProfileTeamMilestones
