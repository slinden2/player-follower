import React, { useContext } from 'react'
import { useQuery } from 'react-apollo-hooks'
import styled from 'styled-components'
import PageContainer from './elements/PageContainer'
import PlayerCardContainer from './card/PlayerCardContainer'
import { PlayerContext } from '../contexts/PlayerContext'
import colors from '../styles/colors'
import TeamCardContainer from './card/TeamCardContainer'
import { LAST_UPDATE } from '../graphql/queries'
import Loader from './elements/Loader'

const RowContainer = styled.div`
  border-radius: 10px;
  padding-top: 1rem;

  &::after {
    content: '';
    display: block;
    height: 3px;
    background-color: ${colors.grey1};
  }
`

const Title = styled.h2``

const LastUpdated = styled.div`
  position: absolute;
  right: 1rem;
  top: 0rem;
  font-size: 0.875rem;
  text-align: center;
  line-height: 0.5rem;

  @media (max-width: 650px) {
    display: none;
  }
`

const formatDate = UTCIsoString => {
  const UTCDate = new Date(UTCIsoString)

  const options = {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }

  return UTCDate.toLocaleDateString(navigator.language, options)
}

const HomePage = () => {
  const { bestPlayers, bestGoalies, numOfGames, setNumOfGames } = useContext(
    PlayerContext
  )
  const { data, loading } = useQuery(LAST_UPDATE)

  if (loading) {
    return <Loader offset />
  }

  const date = formatDate(data.GetLastUpdate.date)

  if (numOfGames !== 5) setNumOfGames(5)

  return (
    <PageContainer title='Welcome to Player Fan'>
      <LastUpdated data-cy='last-updated'>
        <p>Last update</p>
        <p>{date}</p>
      </LastUpdated>
      <RowContainer data-cy='top-skater-container'>
        <Title>Top Skaters of the Last 5 Games</Title>
        <PlayerCardContainer
          query={bestPlayers}
          queryName='BestPlayers'
          numOfCards={5}
        />
      </RowContainer>
      <RowContainer data-cy='top-goalie-container'>
        <Title>Top Goalies of the Last 5 Games</Title>
        <PlayerCardContainer
          query={bestGoalies}
          queryName='BestGoalies'
          numOfCards={5}
        />
      </RowContainer>
      <RowContainer data-cy='top-team-container'>
        <Title>Top Teams of the Last 10 Games</Title>
        <TeamCardContainer
          numOfGames={10}
          sortBy='wins'
          confFilter='ALL'
          numOfCards={5}
        />
      </RowContainer>
    </PageContainer>
  )
}

export default HomePage
