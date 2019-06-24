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

const App = () => {
  const [token, setToken] = useState(null)
  const [activePage, setActivePage] = useState('all')

  const client = useApolloClient()
  const loggedUser = useQuery(USER)
  console.log(loggedUser)

  useEffect(() => {
    const cookies = document.cookie.split(';')
    const pfCookie = cookies.filter(cookie => cookie.startsWith('user='))
    if (pfCookie.length) {
      const token = pfCookie[0].substring(5)
      setToken(token)
    }
  }, [])

  const logout = () => {
    setToken(null)
    document.cookie = 'user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT'
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
        {token && <div>{loggedUser.username}</div>}
        <Route exact path="/" render={() => <CardContainer />} />
        <Route path="/stats" render={() => <div>Stats</div>} />
        <Route path="/standings" render={() => <div>Standings</div>} />
        <Route path="/about" render={() => <div>About</div>} />
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
