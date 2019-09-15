import ReactGA from 'react-ga'
import { getCookie } from '../utils/index'

export const initGA = () => {
  // if (process.env.NODE_ENV === 'production') {
  if (getCookie('gaConsent')) {
    ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_NO)
  }
  // }
}

export const pageView = history => {
  ReactGA.set({ page: history.pathname })
  ReactGA.pageview(history.pathname + history.search)
}

export const event = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  })
}
