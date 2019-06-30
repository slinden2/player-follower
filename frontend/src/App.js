import React, { useState, useEffect, useContext } from 'react'
import { useQuery, useApolloClient } from 'react-apollo-hooks'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container, Header } from 'semantic-ui-react'
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
import { USER } from './graphql/queries'
import { getCookie, removeCookie } from './utils'
import { NotificationContext } from './contexts/NotificationContext'
import { AuthContext } from './contexts/AuthContext'

const App = () => {
  const { notification, setNotification } = useContext(NotificationContext)
  const { user, token, setUser, setToken } = useContext(AuthContext)
  const [activePage, setActivePage] = useState('all')

  const client = useApolloClient()

  const loggedUser = useQuery(USER)

  useEffect(() => {
    const tokenCookie = getCookie('user')
    setToken(tokenCookie)
  }, [setToken])

  useEffect(() => {
    loggedUser.refetch().then(({ data }) => {
      if (data) {
        setUser(data.me)
      }
    })
  }, [loggedUser, setUser, token])

  const logout = () => {
    setToken(null)
    setUser(null)
    removeCookie('user')
    client.resetStore()
    setNotification('positive', 'You have been logged out.')
  }

  return (
    <Container>
      <Router>
        <Header size="huge">Player Follower</Header>
        <TopNavBar
          activePage={activePage}
          setActivePage={setActivePage}
          token={token}
          logout={logout}
        />
        <Notification notification={notification} />
        {user && (
          <div>
            logged in as <strong>{user.username}</strong>
          </div>
        )}
        <Route exact path="/" render={() => <CardContainer />} />
        <Route path="/stats" render={() => <div>Stats</div>} />
        <Route path="/standings" render={() => <div>Standings</div>} />
        <Route path="/about" render={() => <div>About</div>} />
        {user && (
          <>
            <Route path="/favorites" render={() => <div>favorites</div>} />
            <Route path="/profile" render={() => <Profile user={user} />} />
          </>
        )}
        {!token && (
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
                <LoginForm
                  history={history}
                  setActivePage={setActivePage}
                  setToken={setToken}
                />
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
