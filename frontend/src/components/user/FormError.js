import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const Container = styled.div`
  font-size: 0.875rem;
  text-align: center;
  color: ${colors.red1};
  display: ${({ show }) => (show ? 'block' : 'none')};
  margin-top: 5px;

  &::before {
    content: '';
    height: 2px;
    width: 15px;
    background-color: ${colors.red1};
    display: inline-block;
    margin: 0px 5px 3px 5px;
  }
`

const FormError = ({ message, show }) => {
  return (
    <Container show={show} data-cy='form-error'>
      {message}
    </Container>
  )
}

export default FormError
