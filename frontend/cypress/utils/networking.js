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
