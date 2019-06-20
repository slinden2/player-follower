import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container, Header } from 'semantic-ui-react'
import TopNavBar from './components/TopNavBar'
import CardContainer from './components/CardContainer'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import Confirmation from './components/Confirmation'
import Footer from './components/Footer'
import ForgotPassword from './components/ForgotPassword'
import SetNewPassword from './components/SetNewPassword'

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
        <Route path="/login" render={() => <LoginForm />} />
        <Route
          exact
          path="/forgot-password"
          render={() => <ForgotPassword />}
        />
        <Route
          path="/forgot-password/:token"
          render={({ match }) => <SetNewPassword token={match.params.token} />}
        />
        <Route path="/signup" render={() => <SignupForm />} />
        <Route
          path="/confirmation/:token"
          render={({ match }) => <Confirmation token={match.params.token} />}
        />
        <Footer />
      </Router>
    </Container>
  )
}

export default App
