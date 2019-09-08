import React, { createContext, useState } from 'react'

export const ModalContext = createContext()

const ModalContextProvider = props => {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState(null)

  const openModal = type => {
    setOpen(true)
    setType(type)
  }

  const closeModal = () => {
    setOpen(false)
    setType(null)
  }

  const navigateTo = name => {
    setType(name)
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
