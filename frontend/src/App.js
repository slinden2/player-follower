import React, { useState, useEffect } from 'react'
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
  const [token, setToken] = useState(null)

  useEffect(() => {
    const cookies = document.cookie.split(';')
    const pfCookie = cookies.filter(cookie =>
      cookie.startsWith('playerfolloweruser=')
    )
    if (pfCookie.length) {
      const token = pfCookie[0].substring(19)
      setToken(token)
    }
  }, [])

  return (
    <Container>
      <Router>
        <Header size="huge">Player Follower</Header>
        <TopNavBar />
        <Route exact path="/" render={() => <CardContainer />} />
        <Route path="/stats" render={() => <div>Stats</div>} />
        <Route path="/standings" render={() => <div>Standings</div>} />
        <Route path="/about" render={() => <div>About</div>} />
        <Route
          path="/login"
          render={({ history }) => <LoginForm history={history} />}
        />
        <Route
          exact
          path="/forgot-password"
          render={({ history }) => <ForgotPassword history={history} />}
        />
        <Route
          path="/forgot-password/:token"
          render={({ history, match }) => (
            <SetNewPassword history={history} token={match.params.token} />
          )}
        />
        <Route
          path="/signup"
          render={({ history }) => <SignupForm history={history} />}
        />
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
