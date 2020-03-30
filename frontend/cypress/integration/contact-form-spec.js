/// <reference types="Cypress" />

import chaiColors from 'chai-colors'
import colors from '../../src/styles/colors'
import { waitForGQL } from '../utils/networking'

chai.use(chaiColors)

describe('/contact', () => {
  beforeEach(() => {
    cy.server()
    cy.route({
      method: 'POST',
      url: '/graphql',
    }).as('gqlCall')
    cy.visit('/contact')
  })

  // it('loads correctly', () => {
  //   cy.contains('h1', 'Contact')
  //   cy.get('input[name=name]').should('exist')
  //   cy.get('input[name=email]').should('exist')
  //   cy.get('input[name=subject]').should('exist')
  //   cy.get('textarea[name=message]').should('exist')
  //   cy.get('[data-cy=send-button]')
  //     .should('contain', 'Send')
  //     .and('have.css', 'background-color')
  //     .and('be.colored', colors.blue1)
  //   cy.get('[data-cy=cancel-button]')
  //     .should('contain', 'Cancel')
  //     .and('have.css', 'background-color')
  //     .and('be.colored', colors.red1)
  // })

  // it('requires all fields to be filled', () => {
  //   cy.get('[data-cy=send-button]').click()
  //   cy.get('[data-cy=form-error]')
  //     .eq(0)
  //     .should('be.visible')
  //     .and('contain', 'Name is required')

  //   cy.get('[data-cy=form-error]')
  //     .eq(1)
  //     .should('be.visible')
  //     .and('contain', 'Email is required')

  //   cy.get('[data-cy=form-error]')
  //     .eq(2)
  //     .should('be.visible')
  //     .and('contain', 'Subject is required')

  //   cy.get('[data-cy=form-error]')
  //     .eq(3)
  //     .should('be.visible')
  //     .and('contain', 'Message is required')
  // })

  // it('requires name to exist and to be less than 50 chars', () => {
  //   cy.get('input[name=name]').click()
  //   cy.get('h1').click()
  //   cy.get('[data-cy=form-error]')
  //     .eq(0)
  //     .should('be.visible')
  //     .and('contain', 'Name is required')
  //   cy.get('input[name=name]')
  //     .clear()
  //     .type('a'.repeat(51))
  //   cy.get('h1').click()
  //   cy.get('[data-cy=form-error]')
  //     .eq(0)
  //     .should('be.visible')
  //     .and('contain', "Name can't be longer than 50 characters")
  // })

  // it('requires a valid email address', () => {
  //   cy.checkEmailIsRequired()
  // })

  // it('accepts a valid email address', () => {
  //   cy.checkAcceptsValidEmail()
  // })

  // it('requires subject to be 3-50 chars long', () => {
  //   cy.get('input[name=subject]')
  //     .clear()
  //     .type('aa')
  //   cy.get('h1').click()
  //   cy.get('[data-cy=form-error]')
  //     .eq(2)
  //     .should('contain', 'Subject must be at least 3 characters long')
  //   cy.get('input[name=subject]')
  //     .clear()
  //     .type('a'.repeat(51))
  //   cy.get('h1').click()
  //   cy.get('[data-cy=form-error]')
  //     .eq(2)
  //     .should('contain', "Subject can't be longer than 50 characters")
  // })

  // it('requires message to be 10-5000 chars long', () => {
  //   cy.get('textarea[name=message]')
  //     .clear()
  //     .type('aa')
  //   cy.get('h1').click()
  //   cy.get('[data-cy=form-error]')
  //     .eq(3)
  //     .should('be.visible')
  //     .and('contain', 'Message must be at least 10 characters long')
  //   cy.get('textarea[name=message]')
  //     .clear()
  //     .fill('a'.repeat(5001))
  //   cy.get('h1').click()
  //   cy.get('[data-cy=form-error]')
  //     .eq(3)
  //     .should('be.visible')
  //     .and('contain', "Message can't be longer than 5000 characters")
  // })

  it('message can be sent', () => {
    cy.get('input[name=name]').type(Cypress.config().username)
    cy.get('input[name=email]').type(Cypress.config().email)
    cy.get('input[name=subject]').type('Test Message')
    cy.get('textarea[name=message]').type(
      'This is just a test message from the test suite.'
    )
    cy.get('[data-cy=send-button]').click()

    // Verify that backend sends back a valid response
    waitForGQL('sendContactForm', xhr => {
      expect(xhr.status).to.equal(200)
      expect(
        xhr.response.body.data.SendContactForm,
        'Response from SendContactForm resolver should be true'
      ).to.be.true
    })

    cy.get('[data-cy=notification-container]').should(
      'contain',
      'Thanks for the feedback. I will get back to you as soon as possible'
    )
    cy.url().should('equal', Cypress.config().baseUrl + '/')
  })
})
