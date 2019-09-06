import React from 'react'
import styled from 'styled-components'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

const Container = styled.div`
  width: 100%;
  height: 100px;
  border-top: 3px solid ${colors.grey2};
  font-size: 0.75rem;
  margin-top: 16px;

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
        <ListItem>{'Contact & Feedback'}</ListItem>
        <ListItem>Terms and Conditions</ListItem>
        <ListItem>Privacy</ListItem>
      </List>
      <Copyright>
        Copyright &copy; 2019 Player Fan - All Rights Reserved
      </Copyright>
    </Container>
  )
}

export default Footer
