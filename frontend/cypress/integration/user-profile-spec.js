/// <reference types="Cypress" />

import { waitForGQL } from '../utils/networking'

describe('/profile', () => {
  beforeEach(() => {
    cy.server()
    cy.route({
      method: 'POST',
      url: '/graphql',
    }).as('gqlCall')
    cy.fastLogin()
    cy.visit('/profile')
  })

  it('loads correctly', () => {
    cy.contains('h1', 'User Profile')
    cy.get('[data-cy=user-data]')
      .should('contain', Cypress.config().username)
      .and('contain', Cypress.config().email)
    cy.get('[data-cy=change-password-btn]').should('contain', 'Change Password')
  })

  it("'change password' form is toggleable", () => {
    cy.get('[data-cy=change-pw-form-container]').should('not.exist')
    cy.get('[data-cy=change-password-btn]')
      .click()
      .should('contain', 'Cancel')
    cy.get('[data-cy=change-pw-form-container]').should('exist')
    cy.get('[data-cy=change-password-btn]')
      .click()
      .should('contain', 'Change Password')
    cy.get('[data-cy=change-pw-form-container]').should('not.exist')
  })

  it("'change password' fields are required", () => {
    cy.get('[data-cy=change-password-btn]').click()
    cy.get('[data-cy=change-pw-form-btn]').click()
    cy.get('[data-cy=form-error]')
      .eq(0)
      .should('be.visible')
      .and('contain', 'Password is required')
    cy.get('[data-cy=form-error]')
      .eq(1)
      .should('be.visible')
      .and('contain', 'Password is required')
    cy.get('[data-cy=form-error]')
      .eq(2)
      .should('be.visible')
      .and('contain', 'Confirm password is required')
  })

  it('requires a valid old password', () => {
    cy.get('[data-cy=change-password-btn]').click()

    cy.get('[name=oldPassword]').type('ANotValidPW2000')
    cy.get('[name=newPassword]').type('ANotValidPW2000')
    cy.get('[name=confirmNewPassword]').type('ANotValidPW2000')
    cy.get('[data-cy=change-pw-form-btn]').click()

    cy.get('[data-cy=form-notification-container]').should(
      'contain',
      'Invalid old password'
    )
  })

  it('new password and confirm new password must match', () => {
    cy.get('[data-cy=change-password-btn]').click()

    cy.get('[name=oldPassword]').type(Cypress.config().password)
    cy.get('[name=newPassword]').type('ValidNewPW2000')
    cy.get('[name=confirmNewPassword]').type('ValidPassword2001')
    cy.get('[data-cy=change-pw-form-btn]').click()

    cy.get('[data-cy=form-error]')
      .eq(2)
      .should('be.visible')
      .and('contain', 'Passwords must match')
  })

  it('requires a new password to be at least 8 chars long and to contain a number', () => {
    cy.get('[data-cy=change-password-btn]').click()

    cy.get('[name=oldPassword]').type(Cypress.config().password)
    cy.get('[name=newPassword]').type('short')
    cy.get('[name=oldPassword]').click()
    cy.get('[data-cy=form-error]')
      .eq(1)
      .should('be.visible')
      .and('contain', 'Password must be at least 8 characters long')

    cy.get('[name=newPassword]')
      .clear()
      .type('longenough')
    cy.get('[name=oldPassword]').click()
    cy.get('[data-cy=form-error]')
      .eq(1)
      .should('be.visible')
      .and('contain', 'Password must contain at least one number')

    cy.get('[name=newPassword]')
      .clear()
      .type('validpassword1')
    cy.get('[name=oldPassword]').click()
    cy.get('[data-cy=form-error]')
      .eq(1)
      .should('not.be.visible')
  })

  it('is possible to change password', () => {
    cy.get('[data-cy=change-password-btn]').click()

    cy.get('[name=oldPassword]').type(Cypress.config().password)
    cy.get('[name=newPassword]').type('salasana1')
    cy.get('[name=confirmNewPassword]').type('salasana1')
    cy.get('[data-cy=change-pw-form-btn]').click()

    waitForGQL('changePassword', xhr => {
      expect(xhr.status).to.equal(200)
      expect(xhr.response.body.data.ChangePassword.username).to.equal(
        Cypress.config().username
      )
      expect(xhr.response.body.data.ChangePassword.email).to.equal(
        Cypress.config().email
      )
    })

    cy.get('[data-cy=notification-container]').should(
      'contain',
      'Your password has been changed'
    )
  })
})
