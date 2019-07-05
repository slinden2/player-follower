import React, { useState } from 'react'
import { Header, Input, Loader } from 'semantic-ui-react'
import _ from 'lodash'
import faker from 'faker'

const source = _.times(10, () => ({
  title: faker.company.companyName(),
  description: faker.company.catchPhrase(),
  image: faker.internet.avatar(),
  price: faker.finance.amount(0, 100, 2, '$'),
}))

const initialState = {
  isLoading: false,
  results: [],
  value: '',
}

const FindPlayers = () => {
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])

  const handleSearchChange = (e, { value }) => {
    setSearchValue(value)
    setIsLoading(true)
  }

  const showResults = () => !isLoading && results.length > 0

  return (
    <div>
      <Header>Find Players</Header>
      <Input
        placeholder="Search..."
        onChange={_.debounce(handleSearchChange, 500, { leading: true })}
      />
      {isLoading && <Loader active inline="centered" />}
      {showResults() && <div>Search results</div>}
    </div>
  )
}

export default FindPlayers
