import React from 'react'
import styled, { css } from 'styled-components'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'

const List = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  width: 100%;

  @media ${breakpoints.profileWide} {
    margin-left: auto;
    width: initial;
  }
`

const ListItem = styled.li`
  padding: 0 16px;
  width: 100%;

  ${({ isLast }) => !isLast && `border-right: 1px solid ${colors.grey1}`};
`

const commonStyles = css`
  display: block;
  text-align: center;
`

const StatTitle = styled.span`
  ${commonStyles}
  margin-top: 0.5rem;
  line-height: 0.5rem;
`

const Stat = styled.span`
  ${commonStyles}
  font-weight: bold;
  font-size: ${({ smallFont }) => (smallFont ? '1.25rem' : '2rem')};

  @media ${breakpoints.profileWide} {
    font-size: 2rem;
  }
`

const ProfilePrimaryStats = ({ headers, stats }) => {
  const numOfStats = stats.length

  return (
    <List>
      {stats.map((stat, i) => (
        <ListItem key={stat.id} isLast={i === numOfStats - 1}>
          <StatTitle>{headers[stat.id].headerText}</StatTitle>
          <Stat smallFont={numOfStats > 3}>{stat.value}</Stat>
        </ListItem>
      ))}
    </List>
  )
}

export default ProfilePrimaryStats
