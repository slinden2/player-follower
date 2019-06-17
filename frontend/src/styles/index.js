import { normalize } from 'styled-normalize'
import styled, { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  ${normalize}
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const TopNavBar = styled.div`
  display: flex;
`

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const CardRow = styled.div`
  display: flex;
  align-content: flex-start;
  overflow: hidden;
`

const Card = styled.div`
  border: 2px solid #e7e7e7;
  border-radius: 4px;
  padding: 0.5rem;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 10rem;
`

const RedBorder = styled.div`
  border: 1px solid red;
`

export {
  GlobalStyle,
  Wrapper,
  RedBorder,
  TopNavBar,
  CardContainer,
  CardRow,
  Card,
}
