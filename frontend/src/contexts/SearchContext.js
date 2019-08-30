import React, { createContext, useState } from 'react'

export const SearchContext = createContext()

const SearchContextProvider = props => {
  const [searchValue, setSearchValue] = useState(null)

  return (
    <SearchContext.Provider value={{ searchValue, setSearchValue }}>
      {props.children}
    </SearchContext.Provider>
  )
}

export default SearchContextProvider
