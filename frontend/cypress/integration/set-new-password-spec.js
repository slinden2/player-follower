/// <reference types="Cypress" />

import chaiColors from 'chai-colors'
import colors from '../../src/styles/colors'

chai.use(chaiColors)

describe('/forgot-password/:token', () => {
  beforeEach(() => {
    cy.createChangePasswordToken()
    cy.getUserToken().then(res => {
      cy.visit('/forgot-password/' + res.token)
    })
  })

  it('loads correctly', () => {
    cy.contains('h1', 'Set New Password')
    cy.get('input[name=newPassword').should('exist')
    cy.get('input[name=confirmNewPassword').should('exist')
    cy.get('[data-cy=cancel-button]')
      .should('contain', 'Cancel')
      .should('have.css', 'background-color')
      .and('be.colored', colors.red1)
    cy.get('[data-cy=save-button]')
      .should('contain', 'Save Password')
      .should('have.css', 'background-color')
      .and('be.colored', colors.blue1)
  })

  it('clicking Cancel takes to the home page', () => {
    cy.get('[data-cy=cancel-button]').click()
    cy.url().should('equal', Cypress.config().baseUrl + '/')
  })

  it('requires password to be 8-50 chars long', () => {
    cy.checkPasswordLengthValidation('newPassword')
  })

  it('requires password to contain a lowercase char and a number', () => {
    cy.checkPasswordContainNumsAndLetters('newPassword')
  })

  it('requires passwords to match', () => {
    cy.checkPasswordMatchingValidation('newPassword', 'confirmNewPassword')
  })

  it('password can be changed', () => {
    cy.get('input[name=newPassword').type(Cypress.config().newPassword)
    cy.get('input[name=confirmNewPassword').type(
      Cypress.config().newPassword + '{enter}'
    )

    cy.get('[data-cy=notification-container]').should(
      'contain',
      'Your password has been changed. You may now log in with the new password'
    )
    cy.url().should('equal', Cypress.config().baseUrl + '/')

    // Login to verify that the new password works
    cy.fastLogin({ passwordType: 'new' })
    cy.getCookie('user').should('exist')
  })
})
