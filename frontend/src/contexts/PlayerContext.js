import React, { createContext, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  USER,
  BEST_PLAYERS,
  FAVORITE_PLAYERS,
  BEST_GOALIES,
  ALL_PLAYERS,
} from '../graphql/queries'
import { FOLLOW_PLAYER, UNFOLLOW_PLAYER } from '../graphql/mutations'

export const PlayerContext = createContext()

const PlayerContextProvider = props => {
  const [positionFilter, setPositionFilter] = useState('ALL')
  const [teamFilter, setTeamFilter] = useState('ALL')
  const [nationalityFilter, setNationalityFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('POINTS')
  const [goalieSortBy, setGoalieSortBy] = useState('WINS')
  const [numOfGames, setNumOfGames] = useState(5)
  const [filterContext, setFilterContext] = useState('skater')
  const [selectedSeason, setSelectedSeason] = useState('CURRENT')

  const variables = {
    numOfGames,
    positionFilter,
    teamFilter,
    nationalityFilter,
    sortBy,
    selectedSeason,
  }

  const bestPlayers = useQuery(BEST_PLAYERS, {
    variables,
  })

  const bestGoalies = useQuery(BEST_GOALIES, {
    variables: {
      numOfGames,
      positionFilter: 'GOALIE',
      teamFilter,
      nationalityFilter,
      sortBy: goalieSortBy,
      selectedSeason,
    },
  })

  const favoritePlayers = useQuery(FAVORITE_PLAYERS, {
    variables,
    // must set fetchPolicy because Apollo doesnt support partially resetting
    // cache yet. When players get followed/unfollower this query must be
    // fetched again. The query caches results with different filters, so after
    // every follow/unfollow the cache should be reset.
    fetchPolicy: 'network-only',
  })

  const allPlayers = useQuery(ALL_PLAYERS)

  const [followPlayer, { followState }] = useMutation(FOLLOW_PLAYER, {
    refetchQueries: [{ query: FAVORITE_PLAYERS, variables }],
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: USER })
      dataInStore.me.favoritePlayers = dataInStore.me.favoritePlayers.concat(
        response.data.FollowPlayer._id
      )
      store.writeQuery({ query: USER, data: dataInStore })
    },
  })

  const [unfollowPlayer, unfollowState] = useMutation(UNFOLLOW_PLAYER, {
    refetchQueries: [{ query: FAVORITE_PLAYERS, variables }],
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: USER })
      dataInStore.me.favoritePlayers = dataInStore.me.favoritePlayers.filter(
        id => id !== response.data.FollowPlayer._id
      )
      store.writeQuery({ query: USER, data: dataInStore })
    },
  })

  const resetFilters = () => {
    setPositionFilter('ALL')
    setTeamFilter('ALL')
    setNationalityFilter('ALL')
    setSortBy('POINTS')
    setGoalieSortBy('WINS')
    setNumOfGames(5)
    setSelectedSeason('CURRENT')
  }

  return (
    <PlayerContext.Provider
      value={{
        bestPlayers,
        bestGoalies,
        favoritePlayers,
        allPlayers,
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
        goalieSortBy,
        setGoalieSortBy,
        followPlayer,
        unfollowPlayer,
        filterContext,
        setFilterContext,
        resetFilters,
        selectedSeason,
        setSelectedSeason,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  )
}

export default PlayerContextProvider
