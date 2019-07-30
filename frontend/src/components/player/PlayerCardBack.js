import React from 'react'
import { Card, Grid } from 'semantic-ui-react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const NameBar = styled.div`
  background-color: ${colors.blue1};
  position: absolute;
  width: 250px;
  text-align: center;
  margin-left: -5px;
  padding: 8px;
  top: 0px;
  font-size: 1.375rem;
`

const StatRow = styled.div`
  margin-top: ${props => (props.first ? '40px' : '0px')};
`

const StatItem = styled.div`
  display: inline-block;
  width: 50%;
  padding: 5px 10px;
  /* border: 1px solid red; */

  & p {
    width: 50%;
    display: inline-block;
    font-size: 1.125rem;
    margin-bottom: 0;
    /* border: 1px solid red; */
  }

  & p:first-child {
    padding-right: 5px;
    /* text-align: right; */
  }

  & p:last-child {
    padding-left: 5px;
  }
`

const PlayerCardBack = ({ player }) => {
  // {player.firstName} {player.lastName}
  // PPG: {player.stats.powerPlayGoals}
  // PPP: {player.stats.powerPlayPoints}
  // SHG: {player.stats.shortHandedGoals}
  // SHG: {player.stats.shortHandedGoals}
  // FOT: {player.stats.faceOffsTaken}
  // blocked: {player.stats.blocked}
  // TA: {player.stats.takeaways}
  // GA: {player.stats.giveaways}

  return (
    <div>
      <NameBar>{player.firstName + ' ' + player.lastName}</NameBar>
      <StatRow first>
        <StatItem>
          <p>PPG</p>
          <p>{player.stats.powerPlayGoals}</p>
        </StatItem>
        <StatItem>
          <p>PPP</p>
          <p>{player.stats.powerPlayPoints}</p>
        </StatItem>
      </StatRow>
      <StatRow>
        <StatItem>
          <p>SHG</p>
          <p>{player.stats.shortHandedGoals}</p>
        </StatItem>
        <StatItem>
          <p>SHP</p>
          <p>{player.stats.shortHandedPoints}</p>
        </StatItem>
      </StatRow>
      <StatRow>
        <StatItem>
          <p>T/GP</p>
          <p>{player.stats.timeOnIcePerGame}</p>
        </StatItem>
        <StatItem>
          <p>FOT</p>
          <p>{player.stats.faceOffsTaken}</p>
        </StatItem>
      </StatRow>
      <StatRow>
        <StatItem>
          <p>Shots</p>
          <p>{player.stats.shots}</p>
        </StatItem>
        <StatItem>
          <p>Hits</p>
          <p>{player.stats.hits}</p>
        </StatItem>
      </StatRow>
      <StatRow>
        <StatItem>
          <p>TA</p>
          <p>{player.stats.takeaways}</p>
        </StatItem>
        <StatItem>
          <p>GA</p>
          <p>{player.stats.giveaways}</p>
        </StatItem>
      </StatRow>
      <StatRow>
        <StatItem>
          <p>Blocks</p>
          <p>{player.stats.blocked}</p>
        </StatItem>
        {/* <StatItem>
          <p>Shots</p>
          <p>{player.stats.shots}</p>
        </StatItem> */}
      </StatRow>
    </div>
  )
}

export default PlayerCardBack
