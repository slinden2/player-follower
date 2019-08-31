import { useState, useEffect, useRef } from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import _ from 'lodash'
import { FIND_BY_NAME } from '../graphql/queries'

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

  const notify = (type, message) => {
    clearTimeout(timeoutId)
    setNotification({ type, message })
    const id = setTimeout(() => {
      setNotification(null)
      setTimeoutId(null)
    }, 5000)
    setTimeoutId(id)
  }

  return [notification, notify]
}

const useSearch = () => {
  const [search, resetSearch] = useField('search', 'text')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const client = useApolloClient()

  const throttledHandleSearchChange = useRef(
    _.debounce(handleSearchChange, 500)
  )

  async function handleSearchChange(value) {
    setIsLoading(true)
    const foundPlayers = await client.query({
      query: FIND_BY_NAME,
      variables: {
        searchString: value,
      },
    })
    setIsLoading(false)
    setResults(foundPlayers.data.findByName)
  }

  useEffect(() => {
    if (search.value) throttledHandleSearchChange.current(search.value)

    return setResults([])
  }, [search.value])

  return [search, results, isLoading]
}

export { useField, useNotification, useSearch }
