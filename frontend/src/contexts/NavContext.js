import React, { createContext, useState } from 'react'

export const NavContext = createContext()

const NavContextProvider = props => {
  // Dropdown Background element (div)
  const [dropdownBg, setDropdownBg] = useState(null)
  // Position where the dropdown background positioned on page load
  const [initialPos, setInitialPos] = useState(null)

  return (
    <NavContext.Provider
      value={{
        dropdownBg,
        setDropdownBg,
        initialPos,
        setInitialPos,
      }}
    >
      {props.children}
    </NavContext.Provider>
  )
}

export default NavContextProvider
