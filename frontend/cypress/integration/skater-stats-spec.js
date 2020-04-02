/// <reference types="Cypress" />

import { waitLoadMoreRequest } from '../utils/networking'

const statsToSort = [
  'Player',
  'GP',
  'G',
  'A',
  'P',
  'PM',
  'P/G',
  'PPG',
  'PPP',
  'SHG',
  'SHP',
  'Shots',
  'S%',
  'Hits',
  'FOT',
  'FO%',
  'TA',
  'GA',
  'BLK',
  'T/G',
  'PPT/G',
  'SHT/G',
]

const sortTest = stat => {
  specify(`stats can be sorted by ${stat}`, () => {
    cy.testSortByColumn(stat)
  })
}

describe('/players/stats', () => {
  beforeEach(() => {
    cy.server()
    cy.route({
      method: 'POST',
      url: '/graphql',
    }).as('gqlCall')
    cy.visit('/players/stats')
    cy.get('[data-cy=stat-table]').as('statTable')
    cy.get('[data-cy=load-more-button]').as('loadMore')
  })

  it('greets with Player Stats', () => {
    cy.contains('h1', 'Player Stats')
  })

  it('has a filter button', () => {
    cy.get('[data-cy=filter-button]')
      .should('exist')
      .and('contain', 'Show Filters')
  })

  it('has a stat table', () => {
    cy.get('@statTable').should('exist')
  })

  it('has a load more button', () => {
    cy.get('@loadMore').should('exist')
  })

  it('load more button loads more stats', () => {
    cy.get('@loadMore').click()
    waitLoadMoreRequest(xhr => {
      expect(xhr.requestBody.variables.offset, 'Stat offset').to.equal(16)
    })
  })

  context('stat sorting', () => {
    for (const stat of statsToSort) {
      sortTest(stat)
    }
  })
})
