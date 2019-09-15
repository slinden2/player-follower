import ReactGA from 'react-ga'
import { getCookie, setCookie } from '../utils/index'

export const initGA = () => {
  // if (process.env.NODE_ENV === 'production') {
  if (getCookie('gaConsent')) {
    ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_NO)

    // fl cookie allows to record the first pageview after accepting cookies
    if (!getCookie('fl')) {
      ReactGA.pageview(window.location.pathname)
    }

    setCookie('fl', true, 365)
  }
  // }
}

export const pageView = history => {
  ReactGA.set({ page: history.pathname })
  ReactGA.pageview(history.pathname + history.search)
}

export const modalView = name => {
  let newName
  if (name === 'log in') newName = '/login'
  if (name === 'sign up') newName = '/signup'
  if (name === 'forgot password') newName = '/forgot-password'
  ReactGA.set({ page: newName })
  ReactGA.modalview(newName)
}

export const event = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  })
}
