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
