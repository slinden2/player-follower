import { normalize } from 'styled-normalize'
import styled, { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  ${normalize}
  body {
    font-family: Quicksand, sans-serif;
    font-weight: 300;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const TopNavBar = styled.ul`
  list-style: none;
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
  display: flex;
  flex-direction: column;
`

const StatList = styled.ul`
  border: 1px solid red;
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`

const StatItem = styled.li`
  border: 1px solid red;
  padding: 4px;
  flex-grow: 0;
  flex-shrink: 0;
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
  StatList,
  StatItem,
}
