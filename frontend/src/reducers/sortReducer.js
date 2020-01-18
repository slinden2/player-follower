const sortReducer = (state, action) => {
  switch (action.type) {
    case 'SORT_BY':
      if (state.sortBy === action.sortBy) {
        return { ...state, sortDir: state.sortDir === 'ASC' ? 'DESC' : 'ASC' }
      }
      return { ...state, sortBy: action.sortBy, sortDir: 'DESC' }
    case 'LOAD_MORE':
      return { ...state, offset: action.offset }
    case 'FILTER_CHANGE':
      return {
        ...state,
        positionFilter: action.data.positionFilter,
        teamFilter: action.data.teamFilter,
        nationalityFilter: action.data.nationalityFilter,
      }
    default:
      return state
  }
}

export default sortReducer
