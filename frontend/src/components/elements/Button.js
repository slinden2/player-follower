import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const Btn = styled.button`
  background-color: ${({ color }) => color};
  border: 0;
  border-radius: 10px;
  padding: ${({ padding }) => padding};
  text-shadow: 1px 1px ${colors.grey3};
  color: ${colors.white1};
  text-transform: ${({ textTransform }) => textTransform};
  font-size: 1rem;
  letter-spacing: 1px;

  &:hover {
    text-shadow: 0 0 1px ${colors.white1}, 0 0 1px ${colors.white1};
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
  style,
  className,
  dataCy,
}) => {
  const padding = size === 'big' ? '1em' : size === 'medium' ? '0.875em' : '5px'
  const textTransform = fontCase ? fontCase : 'none'

  if (!color) color = colors.blue1

  return (
    <Btn
      type={type}
      onClick={onClick}
      color={color}
      padding={padding}
      textTransform={textTransform}
      disabled={disabled}
      style={style}
      className={className}
      data-cy={dataCy}
    >
      {content}
    </Btn>
  )
}

export default Button
