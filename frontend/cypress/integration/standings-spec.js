/// <reference types="Cypress" />

import teamArray from '../utils/team-array'
import standingsObject from '../utils/standings-object'

// Commented out items excluded from the tets.
// The input data for those stats is always zero
// in the test case, so the sorting can not be
// tested.
const statsToSort = [
  'GP',
  'W',
  'L',
  // 'OT',
  'P',
  'P%',
  'GF',
  'GA',
  // 'OTW',
  // 'SOW',
  'GF/G',
  'GA/G',
  'PP%',
  'PK%',
  'SF/G',
  'SA/G',
  'FOW%',
]

const sortTest = stat => {
  specify(`stats can be sorted by ${stat}`, () => {
    cy.testSortByColumn(stat, standingsObject)
  })
}

describe('/teams/standings', () => {
  beforeEach(() => {
    cy.visit('/teams/standings')
    cy.get('[data-cy=stat-table]').as('statTable')
    cy.get('[data-cy=table-title]').as('tableTitle')
  })

  context('loads correctly', () => {
    it('greets with Standings', () => {
      cy.contains('h1', 'Standings')
    })
    it('has league selector present', () => {
      cy.get('select')
        .should('contain', 'League')
        .and('contain', 'Division')
        .and('contain', 'Conference')
    })
    it('contains a stat table', () => {
      cy.get('@statTable').should('exist')

      for (const team of teamArray) {
        cy.get('@statTable').should('contain', team)
      }
    })
  })
  context('league selector', () => {
    specify('conference view shows correctly', () => {
      cy.get('select').select('Conference')
      cy.get('@statTable').should('have.length', 2)
      cy.get('@tableTitle').eq(0).should('contain', 'Eastern')
      cy.get('@tableTitle').eq(1).should('contain', 'Western')

      for (let i = 0; i < 2; i++) {
        cy.get('@statTable')
          .eq(i)
          .find('tbody')
          .find('tr')
          .should('have.length', 4)
      }
    })
    specify('division view shows correctly', () => {
      cy.get('select').select('Division')
      cy.get('@statTable').should('have.length', 4)
      cy.get('@tableTitle').eq(0).should('contain', 'Metropolitan')
      cy.get('@tableTitle').eq(1).should('contain', 'Atlantic')
      cy.get('@tableTitle').eq(2).should('contain', 'Central')
      cy.get('@tableTitle').eq(3).should('contain', 'Pacific')

      for (let i = 0; i < 4; i++) {
        cy.get('@statTable')
          .eq(i)
          .find('tbody')
          .find('tr')
          .should('have.length', 2)
      }
    })
  })
  context('sorting', () => {
    for (const stat of statsToSort) {
      sortTest(stat)
    }
  })
})
