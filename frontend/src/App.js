import React, { useState, useContext } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container, Header } from 'semantic-ui-react'
import { BEST_PLAYERS, FAVORITE_PLAYERS } from './graphql/queries'
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
  const { user } = useContext(AuthContext)
  const [activePage, setActivePage] = useState('all')

  const bestPlayersResult = useQuery(BEST_PLAYERS)

  const favoritePlayersResult = useQuery(FAVORITE_PLAYERS)
  console.log(favoritePlayersResult)

  return (
    <Container>
      <Router>
        <Header size="huge">Player Follower</Header>
        <TopNavBar activePage={activePage} setActivePage={setActivePage} />
        <Notification notification={notification} />
        {user && (
          <div>
            logged in as <strong>{user.username}</strong>
          </div>
        )}
        <Route
          exact
          path="/"
          render={() => <CardContainer query={bestPlayersResult} />}
        />
        <Route path="/stats" render={() => <div>Stats</div>} />
        <Route path="/standings" render={() => <div>Standings</div>} />
        <Route path="/about" render={() => <div>About</div>} />
        {user && (
          <>
            <Route
              path="/favorites"
              render={() => <CardContainer query={favoritePlayersResult} />}
            />
            <Route path="/profile" render={() => <Profile />} />
          </>
        )}
        {!user && (
          <>
            <Route
              path="/signup"
              render={({ history }) => (
                <SignupForm history={history} setActivePage={setActivePage} />
              )}
            />
            <Route
              path="/login"
              render={({ history }) => (
                <LoginForm history={history} setActivePage={setActivePage} />
              )}
            />
            <Route
              exact
              path="/forgot-password"
              render={({ history }) => (
                <ForgotPassword
                  history={history}
                  setActivePage={setActivePage}
                />
              )}
            />
            <Route
              path="/forgot-password/:token"
              render={({ history, match }) => (
                <SetNewPassword
                  history={history}
                  token={match.params.token}
                  setActivePage={setActivePage}
                />
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
