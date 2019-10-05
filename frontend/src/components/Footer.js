import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

const Container = styled.div`
  width: 100%;
  height: 100px;
  border-top: 3px solid ${colors.grey2};
  font-size: 0.75rem;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media ${breakpoints.narrowScreen} {
    font-size: 0.625rem;
  }
`

const List = styled.ul`
  display: flex;
  justify-content: center;
  padding: 0;
`

const ListItem = styled.li`
  list-style: none;
  padding: 0 10px 0 10px;
`

const Copyright = styled.div`
  display: flex;
  justify-content: center;
`

const Footer = () => {
  return (
    <Container>
      <List>
        <ListItem>
          <Link to="/about">About</Link>
        </ListItem>
        <ListItem>
          <Link to="/terms-and-conditions">{'Terms & Conditions'}</Link>
        </ListItem>
        <ListItem>
          <Link to="/privacy-policy">Privacy</Link>
        </ListItem>
      </List>
      <Copyright>&copy; Copyright 2019 Player Fan</Copyright>
    </Container>
  )
}

export default Footer
