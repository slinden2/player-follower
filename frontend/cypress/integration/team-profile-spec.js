/// <reference types="Cypress" />

import { totalRow, teamProfileObject } from '../utils/team-profile-data'

const statsToSort = [
  'Date',
  'vs.',
  'W',
  'L',
  // 'OT',
  // 'OTW',
  // 'SOW',
  'P',
  'GF',
  'GA',
  'Diff',
  'PM',
  'PPG',
  'PPT',
  'PPA',
  'SHT',
  'SF',
  'SA',
  'FOW',
  'FOT',
  'HF',
  'HA',
  // 'TA',
  'GA',
  // 'BLK',
]

const sortTest = stat => {
  specify(`stats can be sorted by ${stat}`, () => {
    const hasTotalRow = true
    cy.testSortByColumn(stat, teamProfileObject, hasTotalRow)
  })
}

describe('/teams/:team', () => {
  beforeEach(() => {
    cy.visit('/teams/boston-bruins')
    cy.get('[data-cy=profile-primary-bio] > li').as('primaryBio')
    cy.get('[data-cy=profile-header-stats] > li').as('headerStats')
    cy.get('[data-cy=stat-table').as('statTable')
  })

  context('loads correctly', () => {
    it('greets with Team Profile', () => {
      cy.contains('h1', 'Team Profile')
    })
    it('contains primary profile data', () => {
      cy.get('@primaryBio').should('exist').and('have.length', 3)
      cy.get('@primaryBio').eq(0).should('contain', 'Boston')
      cy.get('@primaryBio').eq(1).should('contain', 'Bruins')
      cy.get('@primaryBio').eq(2).should('contain', 'Eastern, Atlantic')
    })
    it('contains primary stats in the header', () => {
      cy.get('@headerStats').should('exist').and('have.length', 4)
      cy.get('@headerStats').eq(0).should('contain', 'GF').and('contain', 4)
      cy.get('@headerStats').eq(1).should('contain', 'GA').and('contain', 6)
      cy.get('@headerStats').eq(2).should('contain', 'PP%').and('contain', 60.0)
      cy.get('@headerStats')
        .eq(3)
        .should('contain', 'PK%')
        .and('contain', 83.33)
    })
  })
  context('game-by-game table', () => {
    it('has two games', () => {
      cy.get('@statTable').find('tbody').find('tr').should('have.length', 3)
    })
    specify('total row sums up the columns correctly', () => {
      cy.get('@statTable')
        .find('tbody')
        .find('tr')
        .eq(2)
        .find('td')
        .then(data => {
          const dataArr = Array.from(data)
            .slice(1)
            .map(el => el.textContent)
          expect(dataArr, 'Total row').to.have.ordered.members(totalRow)
        })
    })
    specify('game row contains a link to the opponent profile', () => {
      cy.get('@statTable')
        .find('tbody')
        .find('tr')
        .eq(0)
        .find('td')
        .eq(1)
        .find('a[href="/teams/edmonton-oilers"]')
        .should('exist')
        .and('contain', 'EDM')
    })
  })
  context('table sorting', () => {
    for (const stat of statsToSort) {
      sortTest(stat)
    }
  })
})
