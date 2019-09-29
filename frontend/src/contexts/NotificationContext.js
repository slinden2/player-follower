import React, { createContext } from 'react'
import { useNotification } from '../hooks'

export const NotificationContext = createContext()

const NotificationContextProvider = props => {
  const [notification, setNotification] = useNotification()

  const handleException = (exception, position) => {
    if (exception.message.startsWith('GraphQL error: ')) {
      exception.message = exception.message.replace(/GraphQL error: /, '')
    }

    setNotification('negative', `${exception.message}`, position)
  }

  return (
    <NotificationContext.Provider
      value={{ notification, setNotification, handleException }}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContextProvider
