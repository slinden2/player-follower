import React from 'react'
import styled from 'styled-components'
import { teamColors } from '../../../utils/'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
  font-family: 'Montserrat', 'Quicksand', 'Arial';
`

const BackgroundCircle = styled.div`
  background-color: ${({ color }) => color};
  border-radius: 50%;
  height: 168px;
  width: 168px;
  position: relative;
`

const Ring = styled.div`
  border: 6px solid ${({ color }) => color};
  border-radius: 50%;
  position: absolute;
  left: 14px;
  top: 14px;
  height: 140px;
  width: 140px;
`

const LastName = styled.div`
  color: ${({ color }) => color};
  position: absolute;
  width: 120px;
  text-align: center;
  left: 50%;
  top: 35%;
  margin-left: -60px;
  font-size: ${({ longName }) => (longName ? '14px' : '20px')};
  text-shadow: 1px 2px 1px #000;
`

const Number = styled.div`
  color: ${({ color }) => color};
  position: absolute;
  width: 120px;
  text-align: center;
  left: 50%;
  top: 45%;
  margin-left: -60px;
  font-size: 56px;
  text-shadow: 1px 2px 1px #000;
`

const ImageCircle = ({ name, number, longName, team }) => {
  return (
    <Container>
      <BackgroundCircle color={teamColors[team].primary}>
        <Ring color={teamColors[team].secondary} />
        <LastName color={teamColors[team].secondary} longName={longName}>
          {name}
        </LastName>
        <Number color={teamColors[team].secondary}>{number}</Number>
      </BackgroundCircle>
    </Container>
  )
}

export default ImageCircle
