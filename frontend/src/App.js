import React, { useContext } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { NotificationContext } from './contexts/NotificationContext'
import { AuthContext } from './contexts/AuthContext'
import { PlayerContext } from './contexts/PlayerContext'
import Navigation from './components/navigation/Navigation'
import PlayerCardContainer from './components/player/PlayerCardContainer'
import Notification from './components/Notification'
import LoginForm from './components/user/LoginForm'
import SignupForm from './components/user/SignupForm'
import Confirmation from './components/user/Confirmation'
import Footer from './components/Footer'
import ForgotPassword from './components/user/ForgotPassword'
import SetNewPassword from './components/user/SetNewPassword'
import UserProfile from './components/user/UserProfile'
import SearchPage from './components/search/SearchPage'
import PlayerStats from './components/player/PlayerStats'
import Standings from './components/team/Standings'
import PlayerProfile from './components/player/PlayerProfile'
import styled from 'styled-components'
import colors from './styles/colors'
import variables from './styles/variables'
import { SearchContext } from './contexts/SearchContext'

const Container = styled.div`
  margin: 0;
  background-color: ${colors.grey1};
`

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: ${variables.topMarginWithNav}px;
`

const App = () => {
  const { notification } = useContext(NotificationContext)
  const { token } = useContext(AuthContext)
  const { bestPlayers, favoritePlayers } = useContext(PlayerContext)
  const { searchValue } = useContext(SearchContext)

  return (
    <Container>
      <Router>
        <Navigation />
        <ContentWrapper>
          <Notification notification={notification} />
          {searchValue && <div>Search value present</div>}
          <Route
            exact
            path="/"
            render={() => (
              <PlayerCardContainer query={bestPlayers} header="Top players" />
            )}
          />
          <Route path="/stats" render={() => <PlayerStats />} />
          <Route path="/standings" render={() => <Standings />} />
          <Route path="/about" render={() => <div>About</div>} />
          <Route path="/search" render={() => <SearchPage />} />
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
                  <PlayerCardContainer
                    query={favoritePlayers}
                    header="Favorite players"
                  />
                )}
              />
              <Route path="/profile" render={() => <UserProfile />} />
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
                  <SetNewPassword
                    history={history}
                    token={match.params.token}
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
        </ContentWrapper>
      </Router>
    </Container>
  )
}

export default App
