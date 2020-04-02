export const waitForGQL = (operationName, onQueryFoundFn) => {
  function waitOnce() {
    cy.wait('@gqlCall').then(xhr => {
      if (xhr.requestBody && xhr.requestBody.operationName === operationName) {
        if (onQueryFoundFn) onQueryFoundFn(xhr)
      } else {
        waitOnce()
      }
    })
  }

  waitOnce()
}

// Needed for the player stat page for the load more button.
// First GetCumulativeStats query loads all the stats and the
// second query, after clicking the button, loads the next
// stats with an offset. In the test case the offset is 16.
export const waitLoadMoreRequest = onQueryFoundFn => {
  function waitOnce() {
    cy.wait('@gqlCall').then(xhr => {
      if (
        xhr.requestBody &&
        xhr.requestBody.operationName === 'GetCumulativeStats' &&
        xhr.requestBody.variables.offset !== 0
      ) {
        if (onQueryFoundFn) onQueryFoundFn(xhr)
      } else {
        waitOnce()
      }
    })
  }

  waitOnce()
}

export const waitForBestPlayers = (
  operationName,
  onQueryFoundFn,
  numOfGamesId
) => {
  function waitOnce() {
    cy.wait('@gqlCall').then(xhr => {
      if (
        xhr.requestBody &&
        xhr.requestBody.operationName === operationName &&
        xhr.responseBody.data.BestPlayers[0].numOfGamesId === numOfGamesId
      ) {
        if (onQueryFoundFn) onQueryFoundFn(xhr)
      } else {
        waitOnce()
      }
    })
  }

  waitOnce()
}
