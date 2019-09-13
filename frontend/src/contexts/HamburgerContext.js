import React, { createContext, useState } from 'react'

export const HamburgerContext = createContext()

const HamburgerContextProvider = props => {
  const [checked, setChecked] = useState(false)

  const handleToggle = () => {
    setChecked(!checked)
  }

  const closeNavi = () => {
    setChecked(false)
  }

  return (
    <HamburgerContext.Provider value={{ checked, handleToggle, closeNavi }}>
      {props.children}
    </HamburgerContext.Provider>
  )
}

export default HamburgerContextProvider
