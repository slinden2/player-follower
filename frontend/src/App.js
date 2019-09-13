import React, { useContext, useEffect } from 'react'
import { Router, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { initGA, pageView } from './utils/tracking'
import { NotificationContext } from './contexts/NotificationContext'
import { AuthContext } from './contexts/AuthContext'
import { PlayerContext } from './contexts/PlayerContext'
import Navigation from './components/navigation/Navigation'
import PlayerCardContainer from './components/player/card/PlayerCardContainer'
import Notification from './components/Notification'
import LoginPage from './components/user/LoginPage'
import SignupPage from './components/user/SignupPage'
import Confirmation from './components/user/Confirmation'
import Footer from './components/Footer'
import ForgotPasswordPage from './components/user/ForgotPasswordPage'
import SetNewPassword from './components/user/SetNewPassword'
import UserProfile from './components/user/UserProfile'
import SearchPage from './components/search/SearchPage'
import PlayerStats from './components/player/PlayerStats'
import Standings from './components/team/Standings'
import PlayerProfile from './components/player/PlayerProfile'
import About from './components/About'
import ContactForm from './components/ContactForm'
import styled from 'styled-components'
import colors from './styles/colors'
import variables from './styles/variables'
import { SearchContext } from './contexts/SearchContext'
import TeamProfile from './components/team/TeamProfile'
import PrivacyPolicy from './components/PrivacyPolicy'
import Modal from './components/elements/Modal'
import TermsAndConditions from './components/TermsAndConditions'
import CookiePolicy from './components/CookiePolicy'

const Container = styled.div`
  margin: 0;
  background-color: ${colors.grey1};
  position: relative;
`

const PageWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: ${variables.topMarginWithNav}px;
`

const ContentBox = styled.div`
  background: ${colors.grey2};
  padding: 1px 10px 10px 10px;
  border-radius: 10px;
  min-height: 90vh;
`

initGA()
const browserHistory = createBrowserHistory()
browserHistory.listen((location, action) => {
  pageView(location)
  if (action === 'PUSH') {
    window.scrollTo(0, 0)
  }
})

const App = () => {
  const { notification } = useContext(NotificationContext)
  const { token } = useContext(AuthContext)
  const { bestPlayers, favoritePlayers } = useContext(PlayerContext)
  const { searchValue } = useContext(SearchContext)

  useEffect(() => {
    // I do this like this, because this way after reload the page
    // is not always homepage.
    pageView(window.location)
  }, [])

  return (
    <Container>
      <Router history={browserHistory}>
        <Modal />
        <Navigation />
        <PageWrapper>
          <ContentBox>
            <Notification notification={notification} position="site" />
            {searchValue && <div>Search value present</div>}
            <Route
              exact
              path="/"
              render={() => (
                <PlayerCardContainer query={bestPlayers} header="Top Players" />
              )}
            />
            <Route path="/stats" render={() => <PlayerStats />} />
            <Route path="/standings" render={() => <Standings />} />
            <Route path="/about" render={() => <About />} />
            <Route
              path="/contact"
              render={({ history }) => <ContactForm history={history} />}
            />
            <Route path="/search" render={() => <SearchPage />} />
            <Route
              path="/terms-and-conditions"
              render={() => <TermsAndConditions />}
            />
            <Route path="/privacy-policy" render={() => <PrivacyPolicy />} />
            <Route
              path="/players/:siteLink"
              render={({ match }) => (
                <PlayerProfile siteLink={match.params.siteLink} />
              )}
            />
            <Route
              path="/teams/:siteLink"
              render={({ match }) => (
                <TeamProfile siteLink={match.params.siteLink} />
              )}
            />
            {token && (
              <>
                <Route
                  path="/favorites"
                  render={() => (
                    <PlayerCardContainer
                      query={favoritePlayers}
                      header="Favorite Players"
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
                  render={({ history }) => <SignupPage history={history} />}
                />
                <Route
                  path="/login"
                  render={({ history }) => <LoginPage history={history} />}
                />
                <Route
                  exact
                  path="/forgot-password"
                  render={({ history }) => (
                    <ForgotPasswordPage history={history} />
                  )}
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
                    <Confirmation
                      history={history}
                      token={match.params.token}
                    />
                  )}
                />
              </>
            )}
          </ContentBox>
        </PageWrapper>
        <Footer />
        <CookiePolicy />
      </Router>
    </Container>
  )
}

export default App
