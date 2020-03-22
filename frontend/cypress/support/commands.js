// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (credentials, disableCookies) => {
  const username = credentials ? credentials.username : 'TeroTestaaja'
  const password = credentials ? credentials.password : 'salasana'

  // Accept cookies to be able to log in
  if (!disableCookies) cy.setCookie('funcConsent', 'true')

  cy.get('form')
    .get('[name=username')
    .type(username)

  cy.get('form')
    .get('[name=password')
    .type(password)

  cy.get('form')
    .get('[type=submit]')
    .click()
})

Cypress.Commands.add('fastLogin', () => {
  const query = `
  mutation {
    Login(username: "TeroTestaaja", password: "salasana") {
      value
      __typename
    }
  }
  `

  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/graphql',
    body: { query },
  }).then(res => {
    cy.setCookie('funcConsent', 'true')
    cy.setCookie('user', res.body.data.Login.value)
  })
})
