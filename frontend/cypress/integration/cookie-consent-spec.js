/// <reference types="Cypress" />

describe('cookie consent', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('[data-cy=cookie-consent-container]').as('cookieContainer')
    cy.get('[data-cy=cookie-accept-button]').as('acceptBtn')
  })

  specify('cookie policy container present on the page', () => {
    cy.get('@cookieContainer').should('exist')
  })

  it('links to cookie policy', () => {
    cy.get('@cookieContainer').find('a[href="/privacy-policy"]').should('exist')
  })

  specify('cookies not present at start', () => {
    cy.getCookie('funcConsent').should('not.exist')
    cy.getCookie('gaConsent').should('not.exist')
    cy.getCookie('fl').should('not.exist')
  })

  specify('clicking Accept adds cookies', () => {
    cy.get('@acceptBtn').click()
    cy.getCookie('funcConsent').should('exist')
    cy.getCookie('gaConsent').should('exist')
    cy.getCookie('fl').should('exist')
    cy.get('@cookieContainer').should('not.exist')
  })

  specify(
    'cookie container not present after accepting cookies and reloading',
    () => {
      cy.get('@acceptBtn').click()
      cy.reload()
      cy.get('@cookieContainer').should('not.exist')
    }
  )
})
