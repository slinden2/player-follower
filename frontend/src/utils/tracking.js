import ReactGA from 'react-ga'

export const initGA = () => {
  // if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_NO)
  // }
}

export const pageView = history => {
  ReactGA.pageview(history.pathname + history.search)
}

export const event = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  })
}
