import React, { createContext, useState } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { USER, BEST_PLAYERS, FAVORITE_PLAYERS } from '../graphql/queries'
import { FOLLOW_PLAYER, UNFOLLOW_PLAYER } from '../graphql/mutations'

export const PlayerContext = createContext()

const PlayerContextProvider = props => {
  const [positionFilter, setPositionFilter] = useState('ALL')
  const [teamFilter, setTeamFilter] = useState('ALL')
  const [nationalityFilter, setNationalityFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('POINTS')
  const [numOfGames, setNumOfGames] = useState(1)

  const variables = {
    numOfGames,
    positionFilter,
    teamFilter,
    nationalityFilter,
    sortBy,
  }

  const bestPlayers = useQuery(BEST_PLAYERS, {
    variables,
  })
  const favoritePlayers = useQuery(FAVORITE_PLAYERS, {
    variables,
    // must set fetchPolicy because Apollo doesnt support partially resetting
    // cache yet. When players get followed/unfollower this query must be
    // fetched again. The query caches results with different filters, so after
    // every follow/unfollow the cache should be reset.
    fetchPolicy: 'network-only',
  })

  const followPlayer = useMutation(FOLLOW_PLAYER, {
    refetchQueries: [{ query: FAVORITE_PLAYERS, variables }],
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: USER })
      dataInStore.me.favoritePlayers = dataInStore.me.favoritePlayers.concat(
        response.data.followPlayer.id
      )
      store.writeQuery({ query: USER, data: dataInStore })
    },
  })

  const unfollowPlayer = useMutation(UNFOLLOW_PLAYER, {
    refetchQueries: [{ query: FAVORITE_PLAYERS, variables }],
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: USER })
      dataInStore.me.favoritePlayers = dataInStore.me.favoritePlayers.filter(
        id => id !== response.data.followPlayer.id
      )
      store.writeQuery({ query: USER, data: dataInStore })
    },
  })

  return (
    <PlayerContext.Provider
      value={{
        bestPlayers,
        favoritePlayers,
        setNumOfGames,
        numOfGames,
        positionFilter,
        setPositionFilter,
        teamFilter,
        setTeamFilter,
        nationalityFilter,
        setNationalityFilter,
        sortBy,
        setSortBy,
        followPlayer,
        unfollowPlayer,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  )
}

export default PlayerContextProvider
