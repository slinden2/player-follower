import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const Btn = styled.button`
  background-color: ${props => props.color};
  border: 0;
  border-radius: 10px;
  padding: 5px;
  text-shadow: 1px 1px ${colors.grey3};
  color: ${colors.white1};

  &:hover {
    font-weight: bolder;
    cursor: pointer;
  }
`

const Button = ({ content, onClick, color }) => {
  return (
    <Btn onClick={onClick} color={color}>
      {content}
    </Btn>
  )
}

export default Button
