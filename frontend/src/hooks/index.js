import { useState } from 'react'

const useField = (name, type) => {
  const [value, setValue] = useState('')

  const onChange = event => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return [{ type, name, value, onChange }, reset]
}

const useNotification = () => {
  const [notification, setNotification] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)

  const notify = (type, message) => {
    clearTimeout(timeoutId)
    setNotification({ type, message })
    const id = setTimeout(() => {
      setNotification(null)
      setTimeoutId(null)
    }, 5000)
    setTimeoutId(id)
  }

  return [notification, notify]
}

export { useField, useNotification }
