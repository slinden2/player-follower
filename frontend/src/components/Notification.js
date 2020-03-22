import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import colors from '../styles/colors'

const FormContainer = styled.div`
  color: ${({ color }) => color};
`

const GlobalContainer = styled.div`
  color: ${colors.white1};
  border-radius: 10px;
  background-color: ${({ color }) => darken(0.05, color)};
  border: 2px solid ${({ color }) => color};
  text-align: center;
  padding: 5px 5px;
  margin: 5px 5px 0px 5px;
`

const Notification = ({ position, notification }) => {
  if (!notification || position !== notification.position) return null

  const typeSelector = {
    positive: { positive: true, color: colors.green1 },
    negative: { negative: true, color: colors.red1 },
    info: { info: true, color: colors.blue1 },
  }

  const type = typeSelector[notification.type]

  return position === 'form' ? (
    <FormContainer {...type} data-cy='form-notification-container'>
      {notification.message}
    </FormContainer>
  ) : (
    <GlobalContainer {...type} data-cy='notification-container'>
      {notification.message}
    </GlobalContainer>
  )
}

export default Notification
