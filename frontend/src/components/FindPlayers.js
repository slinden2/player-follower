import React, { useState } from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import { Header, Input, Loader, Table } from 'semantic-ui-react'
import _ from 'lodash'
import { FIND_BY_NAME } from '../graphql/queries'

const FindPlayers = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const client = useApolloClient()

  const handleSearchChange = async (e, { value }) => {
    if (!value) return setResults([])
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

  const showResults = () => !isLoading && results.length > 0

  return (
    <div>
      <Header>Find Players</Header>
      <Input
        placeholder="Search..."
        onChange={_.debounce(handleSearchChange, 500)}
      />
      {isLoading && <Loader active inline="centered" />}
      {showResults() && (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Nationality</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {results.map(player => (
              <Table.Row key={player.playerId}>
                <Table.Cell>{player.fullName}</Table.Cell>
                <Table.Cell>{player.primaryNumber}</Table.Cell>
                <Table.Cell>{player.nationality}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  )
}

export default FindPlayers
