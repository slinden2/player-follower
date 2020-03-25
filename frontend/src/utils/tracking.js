import ReactGA from 'react-ga'
import ReactPixel from 'react-facebook-pixel'
import { getCookie, setCookie } from '../utils/index'
import config from '../config'

export const initGA = () => {
  if (getCookie('gaConsent')) {
    ReactGA.initialize(config.GA_TRACKING_ID)

    if (process.env.NODE_ENV === 'production') {
      ReactPixel.init(config.FB_PIXEL_ID)
    }

    // fl (first load) cookie allows to record the first pageview after accepting cookies
    if (!getCookie('fl')) {
      ReactGA.pageview(window.location.pathname)
      ReactPixel.pageView()
    }

    setCookie('fl', true, 365)
  }
}

export const pageView = history => {
  ReactGA.set({ page: history.pathname })
  ReactGA.pageview(history.pathname + history.search)
  ReactPixel.pageView()
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
