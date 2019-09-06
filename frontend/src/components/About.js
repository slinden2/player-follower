import React from 'react'
import styled from 'styled-components'
import PageContainer from './elements/PageContainer'

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 750px;
`

const Title = styled.h3``

const Paragraph = styled.p``

const About = () => {
  return (
    <PageContainer title="About">
      <Wrapper>
        <Title>Aim of this site</Title>
        <Paragraph>
          The aim of this site is to provide an easy and convenient way to
          follow individual, active NHL players during the course of the season.
          Player Fan offers an effortles access to all player stats,
          game-by-game performance and goal videos. Many sites provide you with
          pure statistics, but you may feel overwhelmed with the amount of data
          to plow through to find your favorite players.
        </Paragraph>
        <Paragraph>
          For registered users, Player Fan provides a means to add players to
          your personal selection of favorite players and have them available
          for inspection at will.
        </Paragraph>
      </Wrapper>
    </PageContainer>
  )
}

export default About
