import React from 'react'
import styled from 'styled-components'
import colors from '../styles/colors'

const Container = styled.div`
  color: ${({ color }) => color};
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
    <Container {...type}>{notification.message}</Container>
  ) : (
    <Container {...type}>{notification.message}</Container>
  )
}

export default Notification
