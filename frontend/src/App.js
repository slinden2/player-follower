import React from 'react'
import MainTitle from './components/MainTitle'
import TopNavBar from './components/TopNavBar'
import CardContainer from './components/CardContainer'
import Footer from './components/Footer'
import * as S from './styles'

const App = () => {
  return (
    <S.Wrapper>
      <MainTitle />
      <TopNavBar />
      <S.CardContainer>
        <CardContainer />
      </S.CardContainer>
      <Footer />
    </S.Wrapper>
  )
}

export default App
