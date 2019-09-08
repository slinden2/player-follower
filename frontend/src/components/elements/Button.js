import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const Btn = styled.button`
  background-color: ${({ color }) => color || colors.blue1};
  border: 0;
  border-radius: 10px;
  padding: ${({ padding }) => padding};
  text-shadow: 1px 1px ${colors.grey3};
  color: ${colors.white1};
  text-transform: ${({ textTransform }) => textTransform};
  font-size: 1rem;

  &:hover {
    font-weight: bolder;
    cursor: pointer;
  }

  &:disabled {
    cursor: not-allowed;
  }
`

const Button = ({
  type,
  content,
  onClick,
  color,
  size,
  fontCase,
  disabled,
}) => {
  const padding = size === 'big' ? '1em' : '5px'
  const textTransform = fontCase ? fontCase : 'none'

  return (
    <Btn
      type={type}
      onClick={onClick}
      color={color}
      padding={padding}
      textTransform={textTransform}
      disabled={disabled}
    >
      {content}
    </Btn>
  )
}

export default Button
