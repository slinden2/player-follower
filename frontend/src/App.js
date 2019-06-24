import React, { useState, useEffect } from 'react'
import { useQuery, useApolloClient } from 'react-apollo-hooks'
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
import { USER } from './graphql/queries'
import { getCookie, removeCookie } from './utils'

const App = () => {
  const [token, setToken] = useState(null)
  const [activePage, setActivePage] = useState('all')

  const client = useApolloClient()
  const loggedUser = useQuery(USER)

  useEffect(() => {
    const tokenCookie = getCookie('user')
    setToken(tokenCookie)
  }, [])

  useEffect(() => {
    loggedUser.refetch()
  }, [loggedUser, token])

  const logout = () => {
    setToken(null)
    removeCookie('user')
    client.resetStore()
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
        {loggedUser.data.me && (
          <div>
            logged in as <strong>{loggedUser.data.me.username}</strong>
          </div>
        )}
        <Route exact path="/" render={() => <CardContainer />} />
        <Route path="/stats" render={() => <div>Stats</div>} />
        <Route path="/standings" render={() => <div>Standings</div>} />
        <Route path="/about" render={() => <div>About</div>} />
        {token && (
          <>
            <Route path="/favorites" render={() => <div>favorites</div>} />
            <Route path="/profile" render={() => <div>profile</div>} />
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
                <SetNewPassword history={history} token={match.params.token} />
              )}
            />
            <Route
              path="/confirmation/:token"
              render={({ match }) => (
                <Confirmation token={match.params.token} />
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
