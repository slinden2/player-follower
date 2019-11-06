import React from 'react'
import styled, { css } from 'styled-components'
import { teamColors } from '../../utils'
import colors from '../../styles/colors'

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
  border: 1px solid ${colors.grey1};
`

const Ring = styled.div`
  border: 6px solid ${({ color }) => color};
  border-radius: 50%;
  position: absolute;
  left: 13px;
  top: 13px;
  height: 140px;
  width: 140px;
  ${({ borderColor }) =>
    borderColor &&
    css`
      box-shadow: 0px 0px 0px 5px ${borderColor};
    `}
`

const LastName = styled.div`
  color: ${({ color }) => color};
  position: absolute;
  width: 120px;
  text-align: center;
  left: 50%;
  top: 35%;
  margin-left: -60px;
  font-size: ${({ longName }) => (longName ? '12px' : '16px')};
  letter-spacing: 2px;
  ${({ borderColor }) =>
    borderColor &&
    css`
      text-shadow: -1px 0 1px ${borderColor}, 0 1px 1px ${borderColor},
        1px 0 1px ${borderColor}, 0 -1px 1px ${borderColor};
    `}
`

const Number = styled.div`
  color: ${({ color }) => color};
  position: absolute;
  width: 120px;
  text-align: center;
  left: 50%;
  top: ${({ isTeam }) => (isTeam ? '35%' : '45%')};
  margin-left: -60px;
  font-size: ${({ isTeam }) => (isTeam ? '40px' : '52px')};
  letter-spacing: 3px;
  ${({ borderColor }) =>
    borderColor &&
    css`
      text-shadow: -1px 0 1px ${borderColor}, 0 1px 1px ${borderColor},
        1px 0 1px ${borderColor}, 0 -1px 1px ${borderColor};
    `}
`

const ImageCircle = ({ name, number, team }) => {
  const longName = name && name.length > 8

  return (
    <Container>
      <BackgroundCircle color={teamColors[team].primary}>
        <Ring
          color={teamColors[team].secondary}
          borderColor={teamColors[team].tertiary}
        />
        <LastName
          color={teamColors[team].secondary}
          borderColor={teamColors[team].tertiary}
          longName={longName}
        >
          {name && name.toUpperCase()}
        </LastName>
        <Number
          color={teamColors[team].secondary}
          borderColor={teamColors[team].tertiary}
          isTeam={!name}
        >
          {number}
        </Number>
      </BackgroundCircle>
    </Container>
  )
}

export default ImageCircle
