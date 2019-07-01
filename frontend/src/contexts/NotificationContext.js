import React, { createContext } from 'react'
import { useNotification } from '../hooks'

export const NotificationContext = createContext()

const NotificationContextProvider = props => {
  const [notification, setNotification] = useNotification()

  const handleException = exception => {
    setNotification('negative', `${exception.message}`)
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
