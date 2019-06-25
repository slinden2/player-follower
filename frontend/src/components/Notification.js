import React from 'react'
import { Message } from 'semantic-ui-react'

const Notification = ({ notification }) => {
  if (!notification) return null

  const typeSelector = {
    positive: { positive: true },
    negative: { negative: true },
    info: { info: true },
    warning: { warning: true },
  }

  const type = typeSelector[notification.type]

  return (
    <Message {...type}>
      <Message.Content>{`${notification.message}`}</Message.Content>
    </Message>
  )
}

export default Notification
