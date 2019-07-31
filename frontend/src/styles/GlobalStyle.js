import { createGlobalStyle } from 'styled-components'
import { normalize } from 'styled-normalize'
import colors from './colors'

const GlobalStyle = createGlobalStyle`
  ${normalize}

  html {
    box-sizing: border-box;
  }

  *, *:after, *:before {
    box-sizing: inherit
  }

  body {
    font-family: 'Quicksand', Arial;
    color: ${colors.white1};
  }

  a {
    text-decoration: none;
    color: ${colors.white1};
  }
`

export default GlobalStyle
