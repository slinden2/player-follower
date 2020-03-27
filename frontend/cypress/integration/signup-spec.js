/// <reference types="Cypress" />

describe('/signup', () => {
  beforeEach(() => {
    cy.visit('/signup')
  })

  it('greets with Sign Up', () => {
    cy.contains('h1', 'Sign Up')
  })

  it('links to /login', () => {
    cy.contains('Log In').should('have.attr', 'href', '/login')
  })

  it('requires username/email/password/confirm password/recaptcha', () => {
    cy.get('form')
      .contains('button', 'Sign Up')
      .click()
    cy.get('[data-cy=form-error]')
      .eq(0)
      .should('contain', 'Username is required')
    cy.get('[data-cy=form-error]')
      .eq(1)
      .should('contain', 'Email is required')
    cy.get('[data-cy=form-error]')
      .eq(2)
      .should('contain', 'Password is required')
    cy.get('[data-cy=form-error]')
      .eq(3)
      .should('contain', 'Confirm password is required')

    if (process.env.NODE_ENV === 'production') {
      cy.get('[data-cy=form-error]')
        .eq(4)
        .should('contain', 'Please select "I\'m not a robot."')
    }
  })

  it('requires username to be 2-12 chars long', () => {
    cy.get('input[name=username]').type('a')
    cy.contains('h1', 'Sign Up').click()
    cy.get('[data-cy=form-error]').should(
      'contain',
      'Username must be at least 2 characters long'
    )
    cy.get('input[name=username]')
      .clear()
      .type('1234567890123')
    cy.contains('h1', 'Sign Up').click()
    cy.get('[data-cy=form-error]').should(
      'contain',
      "Username can't be longer than 12 characters"
    )
  })

  it('requires a valid email', () => {
    cy.get('input[name=email]').type('a')
    cy.contains('h1', 'Sign Up').click()
    cy.get('[data-cy=form-error]').should('contain', 'Invalid email address')
  })

  it('accepts a valid email', () => {
    cy.get('input[name=email]').type(Cypress.config().email)
    cy.contains('h1', 'Sign Up').click()
    cy.get('[data-cy=form-error]').should('not.be.visible')
  })

  it('requires password to be 8-50 chars long', () => {
    cy.get('input[name=password]').type('1234567')
    cy.contains('h1', 'Sign Up').click()
    cy.get('[data-cy=form-error]').should(
      'contain',
      'Password must be at least 8 characters long'
    )
    cy.get('input[name=password]')
      .clear()
      .type('1'.repeat(51))
    cy.get('[data-cy=form-error]').should(
      'contain',
      "Password can't be longer than 50 characters"
    )
  })

  it('requires password to contain a lowercase char and a number', () => {
    cy.get('input[name=password]').type('LETTERS12345')
    cy.contains('h1', 'Sign Up').click()
    cy.get('[data-cy=form-error]').should(
      'contain',
      'Password must contain at least one lowercase letter'
    )
    cy.get('input[name=password]')
      .clear()
      .type('lettersandnumbers')
    cy.contains('h1', 'Sign Up').click()
    cy.get('[data-cy=form-error]').should(
      'contain',
      'Password must contain at least one number'
    )
  })

  it('requires passwords to match', () => {
    cy.get('input[name=password]').type('hattivatti1')
    cy.get('input[name=confirmPassword]').type('hattivutti1')
    cy.contains('h1', 'Sign Up').click()
    cy.get('[data-cy=form-error]').should('contain', 'Passwords must match')
    cy.get('input[name=confirmPassword]')
      .clear()
      .type('hattivatti1')
    cy.contains('h1', 'Sign Up').click()
    cy.get('[data-cy=form-error]').should('not.be.visible')
  })
})
