import React from 'react'
import styled, { css } from 'styled-components'
import colors from '../../styles/colors'
import icon from '../../assets/magnifying-glass-icon.svg'
import { useSearch } from '../../hooks'
import SearchDropdown from './SearchDropdown'
import RadioContainer from './RadioContainer'
import { FIND_BY_NAME } from '../../graphql/queries'
import Loader from '../elements/Loader'
import { fieldStyling } from '../../styles/forms'

const containerStylingOnNav = css`
  margin: -1px 0 0 -1px; /* makes the borders collapse */
  flex: none;
  padding: 0 1rem;
  height: 100%;
  border-left: 1px solid ${colors.grey2};
  border-right: 1px solid ${colors.grey2};
`

const containerStylingNoNav = css`
  justify-content: center;
`

const SearchContainer = styled.div`
  ${props => (!props.noNav ? containerStylingOnNav : containerStylingNoNav)}
  align-items: center;
  display: flex;
`

const FieldIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 350px;
  margin-right: 10px;
`

const Input = styled.input`
  width: ${props => (props.noNav ? '100%' : '300px')};
  z-index: 10;
  padding-right: 40px;
  ${fieldStyling}
`

const SearchIcon = styled.object`
  width: 24px;
`

const IconContainer = styled.div`
  position: absolute;
  width: 24px;
  top: ${props => (props.isLoading ? 50 : 25)}%;
  right: 15px;
  z-index: 11;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SearchField = ({ noNav }) => {
  const [search, results, isLoading, resetAll, setQuery] = useSearch(
    FIND_BY_NAME
  )

  const showDropdown = results.length > 0

  return (
    <SearchContainer noNav={noNav}>
      <FieldIconContainer>
        <Input {...search} noNav={noNav} />
        <IconContainer isLoading={isLoading}>
          {isLoading ? (
            <Loader small noHeight />
          ) : (
            <SearchIcon type='image/svg+xml' data={icon} />
          )}
        </IconContainer>
        {showDropdown && (
          <SearchDropdown results={results} resetAll={resetAll} noNav={noNav} />
        )}
      </FieldIconContainer>
      <RadioContainer setQuery={setQuery} resetAll={resetAll} noNav={noNav} />
    </SearchContainer>
  )
}

export default SearchField
