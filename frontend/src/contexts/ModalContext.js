import React, { createContext, useState } from 'react'

export const ModalContext = createContext()

const ModalContextProvider = props => {
  const [open, setOpen] = useState(false)

  const openModal = () => {
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
  }

  return (
    <ModalContext.Provider value={{ open, openModal, closeModal }}>
      {props.children}
    </ModalContext.Provider>
  )
}

export default ModalContextProvider
