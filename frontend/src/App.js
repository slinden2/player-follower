import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import MainTitle from './components/MainTitle'
import TopNavBar from './components/TopNavBar'
import CardContainer from './components/CardContainer'
import Footer from './components/Footer'
import * as S from './styles'

const App = () => {
  return (
    <S.Wrapper>
      <Router>
        <MainTitle />
        <TopNavBar />
        <Route
          exact
          path="/"
          render={() => (
            <S.CardContainer>
              <CardContainer />
            </S.CardContainer>
          )}
        />
        <Route path="/stats" render={() => <div>Stats</div>} />
        <Route path="/standings" render={() => <div>Standings</div>} />
        <Route path="/about" render={() => <div>About</div>} />
        <Footer />
      </Router>
    </S.Wrapper>
  )
}

export default App
