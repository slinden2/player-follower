import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container, Header } from 'semantic-ui-react'
import TopNavBar from './components/TopNavBar'
import CardContainer from './components/CardContainer'
import Footer from './components/Footer'
import * as S from './styles'

const App = () => {
  return (
    <Container>
      <Router>
        <Header size="huge">Player Follower</Header>
        <TopNavBar />
        <Route exact path="/" render={() => <CardContainer />} />
        <Route path="/stats" render={() => <div>Stats</div>} />
        <Route path="/standings" render={() => <div>Standings</div>} />
        <Route path="/about" render={() => <div>About</div>} />
        <Footer />
      </Router>
    </Container>
  )
}

export default App
