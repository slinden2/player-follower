import { createGlobalStyle } from 'styled-components'
import colors from './colors'

const GlobalStyle = createGlobalStyle`

  html {
    box-sizing: border-box;
  }

  *, *:after, *:before {
    box-sizing: inherit
  }

  body {
    font-family: 'Open Sans', 'sans-serif', Arial;
    color: ${colors.white1};
    background-color: ${colors.grey1};
    margin: 0;
  }

  a {
    text-decoration: none;
    color: ${colors.white1};
  }

  button, select {
    font-family: 'Quicksand', Arial;
  }
`

export default GlobalStyle
