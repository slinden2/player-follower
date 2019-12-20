const matchTeamsPipeline = filters => {
  const { siteLink } = filters

  if (siteLink) {
    return {
      $match: {
        siteLink,
      },
    }
  }

  // If siteLink is not provided, we just return an empty match object
  // ie we ignore the match stage.
  return {
    $match: {},
  }
}

module.exports = matchTeamsPipeline
