const dev = {
  GA_TRACKING_ID: process.env.REACT_APP_GA_TRACKING_ID_DEV,
  RECAPTCHA_SITE_KEY: process.env.REACT_APP_RECAPTCHA_SITE_KEY_V2_TEST,
}

const prod = {
  GA_TRACKING_ID: process.env.REACT_APP_GA_TRACKING_ID_PROD,
  RECAPTCHA_SITE_KEY: process.env.REACT_APP_RECAPTCHA_SITE_KEY_V2,
  FB_PIXEL_ID: process.env.REACT_APP_FB_PIXEL_ID,
}

const config = process.env.NODE_ENV === 'production' ? prod : dev

export default {
  // common props
  ...config,
}
