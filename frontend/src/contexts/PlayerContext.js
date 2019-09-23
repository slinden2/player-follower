import React, { createContext, useState } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { USER, BEST_PLAYERS, FAVORITE_PLAYERS } from '../graphql/queries'
import { FOLLOW_PLAYER, UNFOLLOW_PLAYER } from '../graphql/mutations'

export const PlayerContext = createContext()

const PlayerContextProvider = props => {
  const [positionFilter, setPositionFilter] = useState('ALL')
  const [teamFilter, setTeamFilter] = useState('ALL')
  const [numOfGames, setNumOfGames] = useState(1)
  const bestPlayers = useQuery(BEST_PLAYERS, {
    variables: { numOfGames, positionFilter, teamFilter },
  })
  const favoritePlayers = useQuery(FAVORITE_PLAYERS, {
    variables: { positionFilter },
  })

  const followPlayer = useMutation(FOLLOW_PLAYER, {
    refetchQueries: [{ query: FAVORITE_PLAYERS }],
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: USER })
      dataInStore.me.favoritePlayers = dataInStore.me.favoritePlayers.concat(
        response.data.followPlayer.id
      )
      store.writeQuery({ query: USER, data: dataInStore })
    },
  })

  const unfollowPlayer = useMutation(UNFOLLOW_PLAYER, {
    refetchQueries: [{ query: FAVORITE_PLAYERS }],
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
        followPlayer,
        unfollowPlayer,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  )
}

export default PlayerContextProvider
