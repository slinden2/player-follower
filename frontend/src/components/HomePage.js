import React, { useContext } from 'react'
import styled from 'styled-components'
import PageContainer from './elements/PageContainer'
import PlayerCardContainer from './card/PlayerCardContainer'
import { PlayerContext } from '../contexts/PlayerContext'
import colors from '../styles/colors'
import TeamCardContainer from './card/TeamCardContainer'

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

const HomePage = () => {
  const { bestPlayers, bestGoalies, numOfGames, setNumOfGames } = useContext(
    PlayerContext
  )
  if (numOfGames !== 5) setNumOfGames(5)

  return (
    <PageContainer title='Welcome to Player Fan'>
      <RowContainer>
        <Title>Top Skaters of the Last 5 Games</Title>
        <PlayerCardContainer
          query={bestPlayers}
          queryName='BestPlayers'
          numOfCards={5}
        />
      </RowContainer>
      <RowContainer>
        <Title>Top Goalies of the Last 5 Games</Title>
        <PlayerCardContainer
          query={bestGoalies}
          queryName='BestGoalies'
          numOfCards={5}
        />
      </RowContainer>
      <RowContainer>
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
