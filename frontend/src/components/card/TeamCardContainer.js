import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { CardContainer } from './styles'
import { BEST_TEAMS } from '../../graphql/queries'
import Loader from '../elements/Loader'
import Card from './Card'

const byConference = (team, comp) =>
  comp === 'ALL'
    ? team
    : team.conference.abbreviation === comp
    ? team
    : team.division.abbreviation === comp
    ? team
    : false

const getValueFromRecord = record => {
  const [a, _, c] = record.split('-')
  // a: wins, b: losses, c: ot | return points
  return a * 2 + c
}

const defineOrder = (stat, a, b) => {
  const aSecondary = a.stats.points
  const bSecondary = b.stats.points

  a = a.stats[stat]
  b = b.stats[stat]

  if (stat === 'homeRecord' || stat === 'awayRecord') {
    a = getValueFromRecord(a)
    b = getValueFromRecord(b)
  }

  return b - a || bSecondary - aSecondary
}

const TeamCardContainer = ({ numOfGames, sortBy, confFilter }) => {
  const { data, loading } = useQuery(BEST_TEAMS, {
    variables: { numOfGames },
  })

  if (loading) {
    return <Loader offset />
  }

  const finalData = data.BestTeams.filter(team =>
    byConference(team, confFilter)
  ).sort((a, b) => defineOrder(sortBy, a, b))

  const createRow = data => {
    if (!data.length) return <div>No results</div>
    return data.map((team, i) => (
      <Card
        key={team._id}
        context='team'
        data={team}
        i={i + 1}
        teamSortBy={sortBy}
      />
    ))
  }

  return <CardContainer>{createRow(finalData)}</CardContainer>
}

export default TeamCardContainer
