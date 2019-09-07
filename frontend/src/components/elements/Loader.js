import React from 'react'
import styled from 'styled-components'
import { rotateLoader } from './keyframes'
import colors from '../../styles/colors'

const Container = styled.div`
  position: relative;

  &::before {
    position: absolute;
    border: solid 3px ${colors.grey5};
    border-bottom-color: ${colors.red1};
    border-radius: 50%;
    content: '';
    height: ${props => props.size}px;
    width: ${props => props.size}px;
    left: 50%;
    top: 50%;
    animation: ${rotateLoader} 1s linear infinite;
    transform-origin: center;
    will-change: transform;
  }
`

const Loader = ({ small }) => {
  const size = small ? 20 : 30

  return <Container size={size} />
}

export default Loader
