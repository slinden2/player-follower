import React, { useContext } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Container, Header } from 'semantic-ui-react'
import { NotificationContext } from './contexts/NotificationContext'
import { AuthContext } from './contexts/AuthContext'
import { PlayerContext } from './contexts/PlayerContext'
import TopNavBar from './components/TopNavBar'
import CardContainer from './components/player/PlayerCardContainer'
import Notification from './components/Notification'
import LoginForm from './components/user/LoginForm'
import SignupForm from './components/user/SignupForm'
import Confirmation from './components/user/Confirmation'
import Footer from './components/Footer'
import ForgotPassword from './components/user/ForgotPassword'
import SetNewPassword from './components/user/SetNewPassword'
import UserProfile from './components/user/UserProfile'
import FindPlayers from './components/player/FindPlayers'
import PlayerStats from './components/player/PlayerStats'
import Standings from './components/team/Standings'
import PlayerProfile from './components/player/PlayerProfile'

const App = () => {
  const { notification } = useContext(NotificationContext)
  const { token } = useContext(AuthContext)
  const { bestPlayers, favoritePlayers } = useContext(PlayerContext)

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
        <Route path="/stats" render={() => <PlayerStats />} />
        <Route path="/standings" render={() => <Standings />} />
        <Route path="/about" render={() => <div>About</div>} />
        <Route
          path="/players/:siteLink"
          render={({ match }) => (
            <PlayerProfile siteLink={match.params.siteLink} />
          )}
        />
        {token && (
          <>
            <Route
              path="/favorites"
              render={() => (
                <>
                  <Container as={Link} to="/find-players">
                    Find players
                  </Container>
                  <CardContainer query={favoritePlayers} />
                </>
              )}
            />
            <Route path="/profile" render={() => <UserProfile />} />
            <Route path="/find-players" render={() => <FindPlayers />} />
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
