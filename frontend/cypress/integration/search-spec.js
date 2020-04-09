/// <reference types="Cypress" />

describe('/search', () => {
  beforeEach(() => {
    cy.visit('/search')
    cy.get('input[name=search]').as('searchField')
    cy.get('input[type=radio][value=teams]').as('teamRadio')
  })

  context('loads correctly', () => {
    it('greets with Search players & teams', () => {
      cy.contains('h1', 'Search players & teams')
    })
    it('has search field', () => {
      cy.get('@searchField').should('exist')
      cy.get('[data-cy=search-result-container]').should('not.exist')
    })
    it('has Players radio button', () => {
      cy.get('label[for=player-radio]').should('exist')
      cy.get('label[for=team-radio]').should('exist')
    })
    it('has Teams radio button', () => {
      cy.get('input[type=radio][value=players]').should('exist')
      cy.get('@teamRadio').should('exist')
    })
  })

  context('search functionality', () => {
    specify('search results render with player names and links', () => {
      cy.get('@searchField').type('al')
      cy.get('[data-cy=search-result-container]')
        .should('exist')
        .within(() => {
          cy.get('[data-cy=search-result]')
            .should('have.length', 2)
            .and('contain', 'Alex DeBrincat')
            .and('contain', 'Josh Archibald')
          cy.get('[data-cy=search-result]')
            .find('a[href="/players/alex-debrincat"]')
            .should('exist')
          cy.get('[data-cy=search-result]')
            .find('a[href="/players/josh-archibald"]')
            .should('exist')
        })
    })
    specify('search result headers render', () => {
      const searchHeaders = ['Player', 'Team', 'Co.']
      cy.get('@searchField').type('al')
      searchHeaders.forEach((header, i) => {
        cy.get('[data-cy=search-header] > div').eq(i).should('contain', header)
      })
    })
    specify(
      'if there are no results, the result container should not render',
      () => {
        cy.get('@searchField').type('Does not exist')
        cy.get('[data-cy=search-result-container]').should('not.exist')
      }
    )
    it('is not possible search teams when players are selected', () => {
      cy.get('@searchField').type('Boston')
      cy.get('[data-cy=search-result-container]').should('not.exist')
    })
    it('is not possible search players when teams are selected', () => {
      cy.get('@teamRadio').click()
      cy.get('@searchField').type('Alex')
      cy.get('[data-cy=search-result-container]').should('not.exist')
    })
    it('is possible to search teams', () => {
      cy.get('@teamRadio').click()
      cy.get('@searchField').type('B')
      cy.get('[data-cy=search-result-container]').should('exist')
    })
    specify('team search results have correct links', () => {
      cy.get('@teamRadio').click()
      cy.get('@searchField').type('B')
      cy.get('[data-cy=search-result-container]').within(() => {
        cy.get('[data-cy=search-result]')
          .should('have.length', 3)
          .and('contain', 'Boston Bruins')
          .and('contain', 'Buffalo Sabres')
          .and('contain', 'Chicago Blackhawks')

        cy.get('[data-cy=search-result]')
          .find('a[href="/teams/boston-bruins"]')
          .should('exist')
        cy.get('[data-cy=search-result]')
          .find('a[href="/teams/buffalo-sabres"]')
          .should('exist')
        cy.get('[data-cy=search-result]')
          .find('a[href="/teams/chicago-blackhawks"]')
          .should('exist')
      })
    })
  })
})
