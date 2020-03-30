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
  const username = credentials
    ? credentials.username
    : Cypress.config().username
  const password = credentials
    ? credentials.password
    : Cypress.config().password

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
    Login(username: "${Cypress.config().username}", password: "${
    Cypress.config().password
  }") {
      value
      __typename
    }
  }
  `

  cy.request({
    method: 'POST',
    url: Cypress.config().baseUrl + '/graphql',
    body: { query },
  }).then(res => {
    cy.setCookie('funcConsent', 'true')
    cy.setCookie('user', res.body.data.Login.value)
  })
})

Cypress.Commands.add('createUser', () => {
  const query = `
  mutation {
    CreateUser(username: "${Cypress.config().username2}", email: "${
    Cypress.config().email2
  }", password: "${Cypress.config().password}", recaptcha: "") {
      ...UserDetails
    }
  }
  
  fragment UserDetails on User {
    id
    username
    email
    __typename
  }
  `

  cy.request({
    method: 'POST',
    url: Cypress.config().baseUrl + '/graphql',
    body: { query },
  })
})

Cypress.Commands.add('getUserToken', () => {
  const query = `
  query {
    GetToken {
      userId
      token
      expireAt
      __typename
    }
  }
  `

  cy.request({
    method: 'POST',
    url: Cypress.config().baseUrl + '/graphql',
    body: { query },
  }).then(res => {
    const {
      body: {
        data: { GetToken },
      },
    } = res
    return {
      userId: GetToken.userId,
      token: GetToken.token,
      expireAt: GetToken.expireAt,
    }
  })
})

Cypress.Commands.add('getUser', id => {
  const query = `
  query {
    GetUser(id: "${id}") {
      id
      username
      isVerified
      __typename
    }
  }
  `

  cy.request({
    method: 'POST',
    url: Cypress.config().baseUrl + '/graphql',
    body: { query },
  })
})

Cypress.Commands.add('fillSignupForm', (username, email, password) => {
  cy.get('input[name=username]').type(username)
  cy.get('input[name=email]').type(email)
  cy.get('input[name=password]').type(password)
  cy.get('input[name=confirmPassword]').type(password)
  cy.get('form')
    .contains('button', 'Sign Up')
    .click()
})

Cypress.Commands.add('teardownDb', () => {
  const query = `
  mutation {
    ResetDB
  }
  `

  cy.request({
    method: 'POST',
    url: Cypress.config().baseUrl + '/graphql',
    body: { query },
  })
})

Cypress.Commands.add('seedDb', () => {
  const query = `
  mutation {
    SeedDB
  }
  `

  cy.request({
    method: 'POST',
    url: Cypress.config().baseUrl + '/graphql',
    body: { query },
  })
})
