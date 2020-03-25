const dev = {
  GA_TRACKING_ID: 'UA-147957080-1',
  RECAPTCHA_SITE_KEY: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
}

const prod = {
  GA_TRACKING_ID: 'UA-147957080-2',
  RECAPTCHA_SITE_KEY: '6LeUHsAUAAAAANg4X83zXGSiuG20xF6bCy5Y1Aem',
  FB_PIXEL_ID: '2729341340419465',
}

const config = process.env.NODE_ENV === 'production' ? prod : dev

export default {
  // common props
  ...config,
}
