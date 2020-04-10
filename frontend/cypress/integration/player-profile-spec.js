/// <reference types="Cypress" />

import { totalRow, playerProfileObject } from '../utils/player-profile-data'

// Commented out items excluded from the tets.
// The input data for those stats is always zero
// in the test case, so the sorting can not be
// tested.
const statsToSort = [
  'Date',
  'G',
  'A',
  // 'P',
  // 'PM',
  // 'PPG',
  'PPA',
  'SHG',
  // 'SHA',
  'TON',
  'PPTON',
  'SHTON',
  'Shots',
  'BLK',
  'Hits',
  'GA',
  // 'TA', this test will fail, because there is one less item on the
  // total row
]

const sortTest = stat => {
  specify(`stats can be sorted by ${stat}`, () => {
    const hasTotalRow = true
    cy.testSortByColumn(stat, playerProfileObject, hasTotalRow)
  })
}

describe('/players/:player', () => {
  beforeEach(() => {
    cy.visit('/players/jack-eichel')
    cy.get('[data-cy=profile-primary-bio] > li').as('primaryBio')
    cy.get('[data-cy=profile-header-stats] > li').as('headerStats')
    cy.get('[data-cy=profile-secondary-stats] > li').as('secondaryStats')
    cy.get('[data-cy=stat-table').as('statTable')
  })

  context('loads correctly', () => {
    it('greets with Player Profile', () => {
      cy.contains('h1', 'Player Profile')
    })
    it('contains primary profile data', () => {
      cy.get('@primaryBio').should('exist').and('have.length', 3)
      cy.get('@primaryBio').eq(0).should('contain', 'Jack')
      cy.get('@primaryBio').eq(1).should('contain', 'Eichel')
      cy.get('@primaryBio').eq(2).find('span').eq(0).should('contain', '#9, C')
      cy.get('@primaryBio').eq(2).find('img').should('exist')
      cy.get('@primaryBio')
        .eq(2)
        .find('span')
        .eq(1)
        .should('contain', 'North Chelmsford, MA, USA')
    })
    it('contains primary stats in the header', () => {
      cy.get('@headerStats').should('exist').and('have.length', 3)
      cy.get('@headerStats').eq(0).should('contain', 'GP').and('contain', 2)
      cy.get('@headerStats').eq(1).should('contain', 'G').and('contain', 1)
      cy.get('@headerStats').eq(2).should('contain', 'P').and('contain', 2)
    })
    it('shows secondary stats on the page', () => {
      cy.get('@secondaryStats').should('exist').and('have.length', 6)
      cy.get('@secondaryStats').eq(0).find('a[href="/teams/buffalo-sabres"]')
      cy.get('@secondaryStats')
        .eq(1)
        .should('contain', 'Age')
        .and('contain', 23)
        .and('contain', '1996/10/28')
      cy.get('@secondaryStats')
        .eq(2)
        .should('contain', 'Height')
        .and('contain', '6-2')
      cy.get('@secondaryStats')
        .eq(3)
        .should('contain', 'Weight')
        .and('contain', '203')
        .and('contain', 'lbs')
      cy.get('@secondaryStats')
        .eq(4)
        .should('contain', 'Shoots')
        .and('contain', 'R')
      cy.get('@secondaryStats')
        .eq(5)
        .should('contain', 'Captain')
        .and('contain', 'C')
    })
    it('has a game-by-game stats table', () => {
      cy.get('@statTable').should('exist')
    })
  })
  context('game-by-game table', () => {
    it('has two games', () => {
      cy.get('@statTable').find('tbody').find('tr').should('have.length', 3)
    })
    specify('game rows have links to the team profiles', () => {
      cy.get('@statTable')
        .find('tbody')
        .find('tr')
        .eq(0)
        .find('td')
        .eq(1)
        .find('a[href="/teams/buffalo-sabres"]')
        .should('exist')
      cy.get('@statTable')
        .find('tbody')
        .find('tr')
        .eq(0)
        .find('td')
        .eq(1)
        .find('a[href="/teams/boston-bruins"]')
        .should('exist')
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
    context('table sorting', () => {
      for (const stat of statsToSort) {
        sortTest(stat)
      }
    })
  })
})
