import React from 'react'
import styled from 'styled-components'
import { rotateLoader } from './keyframes'
import colors from '../../styles/colors'

const height = 10

const Container = styled.div`
  position: relative;
  height: ${props => (props.noHeight ? 0 : height)}vh;
  margin-top: ${props => props.topMargin}vh;

  &::before {
    position: absolute;
    border: solid 3px ${colors.grey5};
    border-bottom-color: ${colors.red1};
    border-radius: 50%;
    content: '';
    height: ${props => props.size}px;
    width: ${props => props.size}px;
    left: 50%;
    top: ${props => (props.noHeight ? '50%' : `${height / 2}vh`)};
    animation: ${rotateLoader} 1s linear infinite;
    transform-origin: center;
    will-change: transform;
  }
`

const Loader = ({ small, offset, noHeight }) => {
  const size = small ? 20 : 50
  const topMargin = offset ? 25 : 0

  return <Container size={size} topMargin={topMargin} noHeight={noHeight} />
}

export default Loader
