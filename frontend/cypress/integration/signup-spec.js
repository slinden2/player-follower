/// <reference types="Cypress" />

describe('/signup', () => {
  beforeEach(() => {
    cy.visit('/signup')
  })

  it('greets with Sign Up', () => {
    cy.contains('h1', 'Sign Up')
  })

  it('links to /signup', () => {
    cy.contains('Log In').should('have.attr', 'href', '/login')
  })

  it('requires username/email/password/confirm password/recaptcha', () => {
    cy.get('form')
      .contains('button', 'Sign Up')
      .click()
    cy.get('[data-cy=form-error]')
      .eq(0)
      .should('be.visible')
      .and('contain', 'Username is required')
    cy.get('[data-cy=form-error]')
      .eq(1)
      .should('be.visible')
      .and('contain', 'Email is required')
    cy.get('[data-cy=form-error]')
      .eq(2)
      .should('be.visible')
      .and('contain', 'Password is required')
    cy.get('[data-cy=form-error]')
      .eq(3)
      .should('be.visible')
      .and('contain', 'Confirm password is required')

    if (process.env.NODE_ENV === 'production') {
      cy.get('[data-cy=form-error]')
        .eq(4)
        .should('be.visible')
        .and('contain', 'Please select "I\'m not a robot."')
    }
  })

  it('requires username to be 2-12 chars long', () => {
    cy.get('input[name=username]').type('a')
    cy.contains('h1', 'Sign Up').click()
    cy.get('[data-cy=form-error]')
      .eq(0)
      .should('be.visible')
      .and('contain', 'Username must be at least 2 characters long')
    cy.get('input[name=username]')
      .clear()
      .type('1234567890123')
    cy.contains('h1', 'Sign Up').click()
    cy.get('[data-cy=form-error]')
      .eq(0)
      .should('be.visible')
      .and('contain', "Username can't be longer than 12 characters")
  })

  it('requires a valid email', () => {
    cy.checkEmailIsRequired()
  })

  it('accepts a valid email', () => {
    cy.checkAcceptsValidEmail()
  })

  it('requires password to be 8-50 chars long', () => {
    cy.checkPasswordLengthValidation('password')
  })

  it('requires password to contain a lowercase char and a number', () => {
    cy.checkPasswordContainNumsAndLetters('password')
  })

  it('requires passwords to match', () => {
    cy.checkPasswordMatchingValidation('password', 'confirmPassword')
  })

  it('requires username and email to be unique', () => {
    cy.fillSignupForm(
      Cypress.config().username,
      'new@email.com',
      Cypress.config().password
    )
    cy.get('[data-cy=form-notification-container]').should(
      'contain',
      'Username or email is taken'
    )

    cy.fillSignupForm(
      Cypress.config().username2,
      Cypress.config().email,
      Cypress.config().password
    )
    cy.get('[data-cy=form-notification-container]').should(
      'contain',
      'Username or email is taken'
    )
  })

  it('is possible to create a new user', () => {
    cy.fillSignupForm(
      Cypress.config().username2,
      Cypress.config().email2,
      Cypress.config().password
    )
    cy.get('[data-cy=notification-container]').should(
      'contain',
      'An account for TatuTestaaja has been created. Before logging in, you must activate your account by clicking the activation link sent to tatu@testaaja.com'
    )
  })
})
