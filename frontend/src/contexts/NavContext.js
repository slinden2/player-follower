import React, { createContext, useState } from 'react'

export const NavContext = createContext()

const NavContextProvider = props => {
  const [dropdownBg, setDropdownBg] = useState(null)

  return (
    <NavContext.Provider value={{ dropdownBg, setDropdownBg }}>
      {props.children}
    </NavContext.Provider>
  )
}

export default NavContextProvider
