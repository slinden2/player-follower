/// <reference types="Cypress" />

describe('navigation', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('[data-cy=nav-header]').as('navHeader')
    cy.get('[data-cy=nav-container]').as('navContainer')
    cy.get('[data-cy=hamburger]').as('hamburger')
    cy.get('[data-cy=nav-item]').as('navItem')
    cy.get('[data-cy=nav-item] > ul').as('navItemDropdown')
  })

  specify('navigation is loaded', () => {
    cy.get('@navHeader').should('exist')
  })

  context('mobile navigation', () => {
    it('is hidden at first', () => {
      cy.get('@navContainer').should('not.be.visible')
    })
    it('is possible to expand the navigation', () => {
      cy.get('@hamburger').click()
      cy.get('@navContainer').should('be.visible')
    })
    specify('nav items are collapsed at first', () => {
      cy.get('@hamburger').click()
      cy.get('@navItem').each(navItem => {
        const ul = navItem.children('ul')
        // has a dropdown menu
        if (ul.length > 0) {
          expect(ul).not.to.be.visible
        }
      })
    })
    it('it is possible to open nav item dropdowns', () => {
      cy.get('@hamburger').click()
      cy.get('@navItem').each(navItem => {
        const ul = navItem.children('ul')
        // has a dropdown menu
        if (ul.length > 0) {
          cy.wrap(navItem)
            .click()
            .within(() => {
              cy.get('ul').should('be.visible')
            })
        }
      })
    })
    it('opening a dropdown closes other open dropdowns', () => {
      cy.get('@hamburger').click()
      cy.get('@navItem').eq(0).click().find('ul').should('be.visible')
      cy.get('@navItem').eq(1).click().should('be.visible')
      cy.get('@navItem').eq(0).find('ul').should('not.be.visible')
    })
  })
})
