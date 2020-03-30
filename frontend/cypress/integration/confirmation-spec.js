/// <reference types="Cypress" />

import chaiColors from 'chai-colors'
import colors from '../../src/styles/colors'

chai.use(chaiColors)

describe('/confirmation/:token', () => {
  it('requires a valid token', () => {
    cy.visit('/confirmation/invalid-token')
    cy.get('[data-cy=confirmation-error]')
      .should(
        'contain',
        'The token is either invalid or already expired. Please check that the address in the address bar corresponds to the link sent to you via email. If not, please try again with a correct token.'
      )
      .should('have.css', 'color')
      .and('be.colored', colors.red1)
  })

  it('accepts a valid token', () => {
    cy.createUser()
    cy.getUserToken().then(data => {
      cy.visit(`/confirmation/${data.token}`)
      cy.get('[data-cy=confirmation-success]').should(
        'contain',
        `The account for ${Cypress.config().username2} (${
          Cypress.config().email2
        }) has been successfully created. You may now log in and start using the site at its full potential`
      )

      cy.getUser(data.userId).then(res => {
        console.log(res)
        const { username, isVerified } = res.body.data.GetUser
        expect(username, 'Usernames correspond').to.equal(
          Cypress.config().username2
        )
        expect(isVerified, 'Account is verified').to.be.true
      })
    })
  })
})
