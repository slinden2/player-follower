import { useState, useEffect, useRef } from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import _ from 'lodash'
import { event } from '../utils/tracking'

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

  const notify = (type, message, position) => {
    clearTimeout(timeoutId)
    setNotification({ type, message, position })
    const id = setTimeout(() => {
      setNotification(null)
      setTimeoutId(null)
    }, 5000)
    setTimeoutId(id)
  }

  return [notification, notify]
}

const useSearch = defaultQuery => {
  const [search, resetSearch] = useField('search', 'text')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const [query, setQuery] = useState(defaultQuery)
  const client = useApolloClient()

  const throttledHandleSearchChange = useRef(
    _.debounce(handleSearchChange, 500)
  )

  async function handleSearchChange(value, query) {
    const queryName = query.definitions[0].selectionSet.selections[0].name.value
    if (value) {
      setIsLoading(true)
      event('SEARCH', `Search ${queryName}`, value)
      const response = await client.query({
        query,
        variables: {
          searchString: value,
        },
      })
      setIsLoading(false)
      setResults(response.data[queryName])
    } else {
      setResults([])
    }
  }

  useEffect(() => {
    throttledHandleSearchChange.current(search.value, query)

    return setResults([])
  }, [query, search.value])

  const resetAll = () => {
    resetSearch()
    setResults([])
  }

  return [search, results, isLoading, resetAll, setQuery]
}

export { useField, useNotification, useSearch }
