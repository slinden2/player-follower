import React, { useState, useContext } from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import { Header, Input, Loader, Table, Button } from 'semantic-ui-react'
import _ from 'lodash'
import { AuthContext } from '../contexts/AuthContext'
import { FIND_BY_NAME } from '../graphql/queries'
import { PlayerContext } from '../contexts/PlayerContext'
import { NotificationContext } from '../contexts/NotificationContext'

const FindPlayers = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const { user } = useContext(AuthContext)
  const { followPlayer } = useContext(PlayerContext)
  const { setNotification, handleException } = useContext(NotificationContext)
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

  const handleFollow = async player => {
    try {
      const followedPlayer = await followPlayer({
        variables: { id: player.id, followType: 'FOLLOW' },
      })
      if (followedPlayer.data.followPlayer) {
        setNotification(
          'positive',
          `You started following ${followedPlayer.data.followPlayer.fullName}.`
        )
      }
    } catch (exception) {
      handleException(exception)
    }
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
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {results.map(player => (
              <Table.Row key={player.playerId}>
                <Table.Cell>{player.fullName}</Table.Cell>
                <Table.Cell>{player.primaryNumber}</Table.Cell>
                <Table.Cell>{player.nationality}</Table.Cell>
                <Table.Cell>
                  <Button
                    primary={
                      user.data.me.favoritePlayers.find(id => id === player.id)
                        ? false
                        : true
                    }
                    disabled={
                      user.data.me.favoritePlayers.find(id => id === player.id)
                        ? true
                        : false
                    }
                    size="tiny"
                    content={'Follow'}
                    onClick={() => handleFollow(player)}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  )
}

export default FindPlayers
