import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const Container = styled.div`
  width: 100%;
  background-color: ${colors.grey1};
  margin-top: -10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`

const List = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  /* font-size: 0.875rem; */
  text-transform: uppercase;
`

const ListItem = styled.li`
  /* border: 1px solid red; */
  flex-grow: 1;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.div`
  color: ${colors.grey5};
  font-size: 0.875rem;
`

const Content = styled.div`
  font-size: 1.5rem;
`

const ProfileSecondaryBioDesktop = ({ data }) => {
  return (
    <Container>
      <List>
        {data.titleArray.map(item => (
          <ListItem key={item}>
            <Title>{data.headers[item].text}</Title>
            <Content>{data[item]}</Content>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export default ProfileSecondaryBioDesktop
