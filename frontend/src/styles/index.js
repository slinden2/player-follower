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
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`

const TopNavBar = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
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
  margin-right: 5px;
  border: 2px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 10rem;
  display: flex;
  flex-direction: column;
  & img {
    border-radius: 50%;
    width: 100px;
    margin: 0 auto;
    border: solid 1px #ccc;
  }
`

const NameWrapper = styled.div`
  margin: 0.5rem auto;
  display: grid;
  grid-template-columns: 32px 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    'number firstname'
    'number lastname';
`

const CardNumber = styled.div`
  grid-area: number;
  margin: auto auto;
`

const CardFirstName = styled.div`
  grid-area: firstname;
`

const CardLastName = styled.div`
  grid-area: lastname;
`

const StatList = styled.ul`
  background-color: #ccc;
  list-style-type: none;
  margin: 0;
  padding: 4px;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`

const StatItem = styled.li`
  margin: 0 5px;

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
  NameWrapper,
  CardNumber,
  CardFirstName,
  CardLastName,
  StatList,
  StatItem,
}
