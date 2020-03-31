/// <reference types="Cypress" />

describe('/forgot-password/', () => {
  beforeEach(() => {
    cy.visit('/forgot-password')
  })

  it('loads correctly', () => {
    cy.contains('h1', 'Forgot Password')
    cy.get('[data-cy=forgot-password-field]').should('exist')
    cy.get('button[type=submit]')
      .should('contain', 'Reset Password')
      .and('exist')
  })

  it('links to /login', () => {
    cy.contains('a', 'Log In').should('have.attr', 'href', '/login')
  })

  it('requires a valid email address', () => {
    cy.get('[data-cy=forgot-password-field]').type('aaa{enter}')
    cy.get('[data-cy=form-error]')
      .should('be.visible')
      .and('contain', 'Invalid email address')
  })

  it('requires an existing email address', () => {
    cy.get('[data-cy=forgot-password-field]').type('notavalid@email.com{enter}')
    cy.get('[data-cy=form-notification-container]')
      .should('be.visible')
      .and('contain', 'Invalid email address')
  })

  it('password can be reset', () => {
    // Submit change password request with the email
    // for the account that password is to be changed
    cy.get('[data-cy=forgot-password-field]').type(
      `${Cypress.config().email}{enter}`
    )
    cy.get('[data-cy=notification-container]').should(
      'contain',
      `The password reset link has been set to ${
        Cypress.config().email
      }. Please click the link to change your password`
    )
    cy.url().should('equal', Cypress.config().baseUrl + '/')

    // Check that a token for changing the password has been created
    cy.getUserToken().then(res => {
      cy.getUser(res.userId).then(res => {
        expect(
          res.body.data.GetUser.username,
          'Username of the token match with the requested username'
        ).to.equal(Cypress.config().username)
      })
    })
  })
})
