import React, { useState, useContext } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom'
import { Container, Header } from 'semantic-ui-react'
import { BEST_PLAYERS } from './graphql/queries'
import TopNavBar from './components/TopNavBar'
import CardContainer from './components/CardContainer'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import Confirmation from './components/Confirmation'
import Footer from './components/Footer'
import ForgotPassword from './components/ForgotPassword'
import SetNewPassword from './components/SetNewPassword'
import Profile from './components/Profile'
import { NotificationContext } from './contexts/NotificationContext'
import { AuthContext } from './contexts/AuthContext'

const App = () => {
  const { notification } = useContext(NotificationContext)
  const { token, favPlayerRanking } = useContext(AuthContext)

  const bestPlayers = useQuery(BEST_PLAYERS)

  return (
    <Container>
      <Router>
        <Header size="huge">Player Follower</Header>
        <TopNavBar />
        <Notification notification={notification} />
        <Route
          exact
          path="/"
          render={() => <CardContainer query={bestPlayers} />}
        />
        <Route path="/stats" render={() => <div>Stats</div>} />
        <Route path="/standings" render={() => <div>Standings</div>} />
        <Route path="/about" render={() => <div>About</div>} />
        {token && (
          <>
            <Route
              path="/favorites"
              render={() => <CardContainer query={favPlayerRanking} />}
            />
            <Route path="/profile" render={() => <Profile />} />
          </>
        )}
        {!token && (
          <>
            <Route
              path="/signup"
              render={({ history }) => <SignupForm history={history} />}
            />
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
              path="/confirmation/:token"
              render={({ history, match }) => (
                <Confirmation history={history} token={match.params.token} />
              )}
            />
          </>
        )}
        <Footer />
      </Router>
    </Container>
  )
}

export default App
