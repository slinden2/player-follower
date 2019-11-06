import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const Triangle = styled.div`
  position: absolute;
  background-color: ${colors.red1};
  text-align: left;
  width: 50px;
  height: 50px;
  right: 0;
  bottom: 0;
  border-bottom-right-radius: 10px;
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
  cursor: pointer;

  &::before,
  ::after {
    content: '';
    position: absolute;
    background-color: inherit;
  }

  &::before,
  ::after {
    width: 50px;
    height: 50px;
    border-bottom-right-radius: 10px;
  }
`

const Text = styled.div`
  position: absolute;
  left: -14px;
  bottom: 5px;
  width: 100px;
  text-align: center;
  font-size: 1rem;
  font-family: arial;
  display: block;
  transform: rotate(-45deg);
  z-index: 10;
`

const FlipDiv = ({ onClick }) => {
  return (
    <Triangle onClick={onClick}>
      <Text>Flip</Text>
    </Triangle>
  )
}

export default FlipDiv
