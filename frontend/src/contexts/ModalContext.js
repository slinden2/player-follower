import React, { createContext, useState } from 'react'
import { modalView, event } from '../utils/tracking'

export const ModalContext = createContext()

const ModalContextProvider = props => {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState(null)

  const openModal = type => {
    setOpen(true)
    setType(type)
    event('USER_ACTION', 'Open modal', type)
    modalView(type)
  }

  const closeModal = () => {
    setOpen(false)
    setType(null)
  }

  const navigateTo = name => {
    setType(name)
    event('USER_ACTION', 'Navigate between modals', `${type} => ${name}`)
    modalView(name)
  }

  return (
    <ModalContext.Provider
      value={{ open, type, openModal, closeModal, navigateTo }}
    >
      {props.children}
    </ModalContext.Provider>
  )
}

export default ModalContextProvider
