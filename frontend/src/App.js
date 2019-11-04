import React, { useContext, useEffect, useState } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { initGA, pageView } from './utils/tracking'
import { NotificationContext } from './contexts/NotificationContext'
import ProtectedRoute from './components/route/ProtectedRoute'
import NoTokenRoute from './components/route/NoTokenRoute'
import Navigation from './components/navigation/Navigation'
import PlayerCardPage from './components/player/card/PlayerCardPage'
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
import { getCookie } from './utils'
import NoMatchPage from './components/NoMatchPage'
import TeamCardPage from './components/card/TeamCardPage'

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

const browserHistory = createBrowserHistory()
browserHistory.listen((location, action) => {
  pageView(location)
  if (action === 'PUSH') {
    window.scrollTo(0, 0)
  }
})

const App = () => {
  const { notification } = useContext(NotificationContext)
  const { searchValue } = useContext(SearchContext)
  const [cookieConsent, setCookieConsent] = useState(getCookie('funcConsent'))

  useEffect(() => {
    // I do this like this, because this way after reload the page
    // is not always homepage.
    pageView(window.location)
  }, [])

  if (cookieConsent) initGA()

  return (
    <Container>
      <Router history={browserHistory}>
        <Modal />
        <Navigation />
        <PageWrapper>
          <ContentBox>
            <Notification notification={notification} position="site" />
            {searchValue && <div>Search value present</div>}
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <PlayerCardPage
                    queryName="BestPlayers"
                    header="Top Players"
                  />
                )}
              />
              <Route path="/players/stats" render={() => <PlayerStats />} />
              <Route path="/teams/top-teams" render={() => <TeamCardPage />} />
              <Route path="/teams/standings" render={() => <Standings />} />
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
              <ProtectedRoute
                path="/favorites"
                render={() => (
                  <PlayerCardPage
                    queryName="FavoritePlayers"
                    header="Favorite Players"
                  />
                )}
              />
              <ProtectedRoute path="/profile" render={() => <UserProfile />} />
              <NoTokenRoute
                path="/login"
                render={({ history }) => <LoginPage history={history} />}
              />
              <NoTokenRoute
                path="/signup"
                render={({ history }) => <SignupPage history={history} />}
              />
              <NoTokenRoute
                path="/login"
                render={({ history }) => <LoginPage history={history} />}
              />
              <NoTokenRoute
                exact
                path="/forgot-password"
                render={({ history }) => (
                  <ForgotPasswordPage history={history} />
                )}
              />
              <NoTokenRoute
                path="/forgot-password/:token"
                render={({ history, match }) => (
                  <SetNewPassword
                    history={history}
                    token={match.params.token}
                  />
                )}
              />
              <NoTokenRoute
                path="/confirmation/:token"
                render={({ history, match }) => (
                  <Confirmation history={history} token={match.params.token} />
                )}
              />
              <Route
                render={({ history }) => <NoMatchPage history={history} />}
              />
            </Switch>
          </ContentBox>
        </PageWrapper>
        <Footer />
        {!getCookie('funcConsent') && (
          <CookiePolicy setCookieConsent={setCookieConsent} />
        )}
      </Router>
    </Container>
  )
}

export default App
