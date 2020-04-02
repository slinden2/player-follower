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

import skaterStatObject from '../utils/skater-stat-object'

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

Cypress.Commands.add('fastLogin', options => {
  const opts = options || {}
  const { passwordType } = opts

  let password = Cypress.config().password

  if (passwordType) {
    password = passwordType === 'new' ? Cypress.config().newPassword : password
  }

  const query = `
  mutation {
    Login(username: "${Cypress.config().username}", password: "${password}") {
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

Cypress.Commands.add('createChangePasswordToken', () => {
  const query = `
  mutation {
    ForgotPassword(email: "${Cypress.config().email}") {
      id
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

// For filling a textarea fast
Cypress.Commands.add(
  'fill',
  {
    prevSubject: 'element',
  },
  ($subject, value) => {
    const el = $subject[0]
    el.value = value
    return cy.wrap($subject).type('a{backspace}')
  }
)

// Password validation checks
Cypress.Commands.add('checkPasswordLengthValidation', name => {
  cy.get(`input[name=${name}]`).type('1234567')
  cy.get('h1').click()
  cy.get('[data-cy=form-error]')
    .should('contain', 'Password must be at least 8 characters long')
    .and('be.visible')
  cy.get(`input[name=${name}]`)
    .clear()
    .type('1'.repeat(51))
  cy.get('[data-cy=form-error]')
    .should('contain', "Password can't be longer than 50 characters")
    .and('be.visible')
})

Cypress.Commands.add('checkPasswordContainNumsAndLetters', name => {
  cy.get(`input[name=${name}]`).type('LETTERS12345')
  cy.get('h1').click()
  cy.get('[data-cy=form-error]')
    .should('contain', 'Password must contain at least one lowercase letter')
    .and('be.visible')
  cy.get(`input[name=${name}]`)
    .clear()
    .type('lettersandnumbers')
  cy.get('h1').click()
  cy.get('[data-cy=form-error]')
    .should('contain', 'Password must contain at least one number')
    .and('be.visible')
})

Cypress.Commands.add('checkPasswordMatchingValidation', (name, confirmName) => {
  cy.get(`input[name=${name}]`).type('hattivatti1')
  cy.get(`input[name=${confirmName}]`).type('hattivutti1')
  cy.get('h1').click()
  cy.get('[data-cy=form-error]')
    .should('contain', 'Passwords must match')
    .and('be.visible')
  cy.get(`input[name=${confirmName}]`)
    .clear()
    .type('hattivatti1')
  cy.get('h1').click()
  cy.get('[data-cy=form-error]').should('not.be.visible')
})

// Email validation checks
Cypress.Commands.add('checkEmailIsRequired', () => {
  cy.get('input[name=email]').type('a')
  cy.get('h1').click()
  cy.get('[data-cy=form-error]')
    .eq(1)
    .should('be.visible')
    .and('contain', 'Invalid email address')
})

Cypress.Commands.add('checkAcceptsValidEmail', () => {
  cy.get('input[name=email]').type(Cypress.config().email)
  cy.get('h1').click()
  cy.get('[data-cy=form-error]')
    .eq(1)
    .should('not.be.visible')
})

// Data cards
Cypress.Commands.add('cardIsFlipped', cardNum => {
  cy.get('[data-cy=card-back]')
    .eq(cardNum)
    .should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)')
    .get('[data-cy=card-front]')
    .eq(cardNum)
    .should(
      'have.css',
      'transform',
      'matrix3d(-1, 0, 1.22465e-16, 0, 0, 1, 0, 0, -1.22465e-16, 0, -1, 0, 0, 0, 0, 1)'
    )
})

Cypress.Commands.add('cardIsNotFlipped', cardNum => {
  cy.get('[data-cy=card-back]')
    .eq(cardNum)
    .should(
      'have.css',
      'transform',
      'matrix3d(-1, 0, -1.22465e-16, 0, 0, 1, 0, 0, 1.22465e-16, 0, -1, 0, 0, 0, 0, 1)'
    )
    .get('[data-cy=card-front]')
    .eq(cardNum)
    .should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)')
})

// Tables
Cypress.Commands.add('getValuesByColumn', columnName => {
  let index
  cy.get('table thead th').each(($el, $index) => {
    if ($el.text() === columnName) {
      index = $index
    }
  })

  let cellContents = []
  cy.get('table tbody tr')
    .each($el => {
      cellContents.push($el[0].cells[index].innerText)
    })
    .then(() => {
      return cellContents
    })
})

Cypress.Commands.add('testSortByColumn', columnName => {
  cy.contains('table thead th', RegExp(`^${columnName}$`)).click()

  cy.getValuesByColumn(columnName).then(points => {
    expect(points, columnName).to.have.ordered.members(
      skaterStatObject[columnName.toLowerCase()]
    )
  })

  cy.contains('table thead th', RegExp(`^${columnName}$`)).click()

  cy.getValuesByColumn(columnName).then(points => {
    expect(points, columnName).not.to.have.ordered.members(
      skaterStatObject[columnName.toLowerCase()]
    )
    expect(points, columnName).to.have.ordered.members(
      skaterStatObject[columnName.toLowerCase()].slice().reverse()
    )
  })

  cy.contains('table thead th', RegExp(`^${columnName}$`)).click()

  cy.getValuesByColumn(columnName).then(points => {
    expect(points, columnName).to.have.ordered.members(
      skaterStatObject[columnName.toLowerCase()]
    )
  })
})
