import React, { createContext } from 'react'
import { useNotification } from '../hooks'

export const NotificationContext = createContext()

const NotificationContextProvider = props => {
  const [notification, setNotification] = useNotification()

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContextProvider
